import type { ChannelsStatusSnapshot, ModelCatalogEntry, SkillStatusReport } from "../types.ts";
import { resolveModelPrimary } from "./agents-utils.ts";

export type OnboardingStepId =
  | "welcome"
  | "theme"
  | "setup"
  | "security"
  | "workspace"
  | "models"
  | "channels"
  | "skills"
  | "complete";

type AgentLikeConfig = {
  tools?: {
    profile?: string;
  };
  agents?: {
    defaults?: {
      model?: unknown;
      models?: Record<string, unknown>;
      workspace?: string;
      systemPrompt?: string;
      sandbox?: {
        mode?: string;
      };
    };
    list?: Array<{ model?: unknown }>;
  };
  gateway?: {
    bind?: string;
    port?: number;
    auth?: { mode?: string };
    remote?: { url?: string | null };
  };
  wizard?: {
    lastRunMode?: string;
    lastRunAt?: string;
  };
};

export type OnboardingSetupState = {
  mode: "local" | "remote";
  bind: string;
  authMode: string;
  port: number | null;
  remoteUrl: string | null;
  workspace: string | null;
  wizardLastRunMode: string | null;
  wizardLastRunAt: string | null;
};

export type OnboardingChannelState = {
  id: string;
  label: string;
  detail: string;
  glyph: string;
  configured: boolean;
  running: boolean;
  connected: boolean;
};

export type OnboardingStepStatus = "current" | "complete" | "upcoming";

export type OnboardingSecurityState = {
  toolProfile: "coding" | "full" | "minimal";
  notifications: boolean;
  fileAccess: boolean;
  sandboxMode: boolean;
};

export type OnboardingWorkspaceState = {
  path: string | null;
  personality: string | null;
  autoSave: boolean;
};

export type OnboardingSkillState = {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  category: string;
  installId: string | null;
  canInstall: boolean;
  alwaysEnabled: boolean;
};

export function hasConfiguredModel(config: Record<string, unknown> | null): boolean {
  if (!config) {
    return false;
  }
  const snapshot = config as AgentLikeConfig;
  if (resolveModelPrimary(snapshot.agents?.defaults?.model)) {
    return true;
  }
  const list = snapshot.agents?.list ?? [];
  return list.some((entry) => Boolean(resolveModelPrimary(entry?.model)));
}

export function hasConfiguredChannels(snapshot: ChannelsStatusSnapshot | null): boolean {
  if (!snapshot) {
    return false;
  }
  return resolveOnboardingChannels(snapshot).some(
    (channel) => channel.configured || channel.running || channel.connected,
  );
}

export function resolveShouldShowOnboarding(params: {
  forced: boolean;
  dismissed: boolean;
  connected: boolean;
  configSnapshot: { valid?: boolean | null; exists?: boolean | null; config?: Record<string, unknown> | null } | null;
  configForm: Record<string, unknown> | null;
  channelsSnapshot: ChannelsStatusSnapshot | null;
}): boolean {
  if (params.forced) {
    return true;
  }
  if (!params.connected || params.dismissed) {
    return false;
  }
  if (params.configSnapshot?.valid === false) {
    return false;
  }
  if (params.configSnapshot?.exists === false) {
    return true;
  }
  const config = params.configForm ?? params.configSnapshot?.config ?? null;
  if (!params.configSnapshot && !params.channelsSnapshot) {
    return false;
  }
  return !hasConfiguredModel(config) && !hasConfiguredChannels(params.channelsSnapshot);
}

function isLoopbackHost(hostname: string): boolean {
  return /^(127\.0\.0\.1|localhost|::1)$/i.test(hostname);
}

export function resolveOnboardingSetup(
  config: Record<string, unknown> | null,
  gatewayUrl: string,
): OnboardingSetupState {
  const snapshot = (config ?? {}) as AgentLikeConfig;
  const remoteUrl = snapshot.gateway?.remote?.url?.trim() || null;
  let mode: "local" | "remote" = remoteUrl ? "remote" : "local";
  try {
    const parsed = new URL(gatewayUrl.replace(/^ws/i, "http"));
    if (!isLoopbackHost(parsed.hostname)) {
      mode = "remote";
    }
  } catch {
    // ignore malformed URL and fall back to config-derived mode
  }
  return {
    mode,
    bind: snapshot.gateway?.bind?.trim() || "loopback",
    authMode: snapshot.gateway?.auth?.mode?.trim() || "token",
    port: typeof snapshot.gateway?.port === "number" ? snapshot.gateway.port : null,
    remoteUrl,
    workspace: snapshot.agents?.defaults?.workspace?.trim() || null,
    wizardLastRunMode: snapshot.wizard?.lastRunMode?.trim() || null,
    wizardLastRunAt: snapshot.wizard?.lastRunAt?.trim() || null,
  };
}

export function resolveConfiguredModel(config: Record<string, unknown> | null): string | null {
  const snapshot = (config ?? {}) as AgentLikeConfig;
  return resolveModelPrimary(snapshot.agents?.defaults?.model);
}

export function resolveOnboardingProviders(models: ModelCatalogEntry[]): string[] {
  const providers = new Set<string>();
  for (const entry of models) {
    const provider = entry.provider?.trim();
    if (provider) {
      providers.add(provider);
    }
  }
  return [...providers].toSorted((a, b) => a.localeCompare(b));
}

export function resolveOnboardingModelsForProvider(
  models: ModelCatalogEntry[],
  provider: string | null,
): ModelCatalogEntry[] {
  const filtered = provider ? models.filter((entry) => entry.provider === provider) : models;
  const seen = new Set<string>();
  const unique: ModelCatalogEntry[] = [];
  for (const entry of filtered) {
    const id = entry.id.trim();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    unique.push(entry);
  }
  return unique.slice(0, 12);
}

export function resolveOnboardingChannels(
  snapshot: ChannelsStatusSnapshot | null,
): OnboardingChannelState[] {
  if (!snapshot) {
    return [];
  }
  const meta = snapshot.channelMeta ?? [];
  const ids = meta.length > 0 ? meta.map((entry) => entry.id) : Object.keys(snapshot.channels ?? {});
  return ids.map((id) => {
    const info = meta.find((entry) => entry.id === id);
    const channel = (snapshot.channels as Record<string, unknown> | undefined)?.[id] as
      | Record<string, unknown>
      | undefined;
    const accounts = snapshot.channelAccounts?.[id] ?? [];
    const configured =
      channel?.configured === true || accounts.some((account) => account.configured === true);
    const running = channel?.running === true || accounts.some((account) => account.running === true);
    const connected =
      channel?.connected === true || accounts.some((account) => account.connected === true);
    const label = info?.label ?? id;
    return {
      id,
      label,
      detail: info?.detailLabel ?? `${label} messaging`,
      glyph: label.slice(0, 1).toUpperCase(),
      configured,
      running,
      connected,
    };
  });
}

export function resolveOnboardingSecurity(config: Record<string, unknown> | null): OnboardingSecurityState {
  const snapshot = (config ?? {}) as AgentLikeConfig;
  const sandboxMode = snapshot.agents?.defaults?.sandbox?.mode;
  const profile = snapshot.tools?.profile;
  return {
    toolProfile:
      profile === "full" || profile === "minimal" || profile === "coding" ? profile : "coding",
    notifications: true,
    fileAccess: true,
    sandboxMode: sandboxMode === "non-main" || sandboxMode === "all",
  };
}

export function resolveOnboardingWorkspace(config: Record<string, unknown> | null): OnboardingWorkspaceState {
  const snapshot = (config ?? {}) as AgentLikeConfig;
  return {
    path: snapshot.agents?.defaults?.workspace?.trim() || null,
    personality: snapshot.agents?.defaults?.systemPrompt?.trim() || null,
    autoSave: true,
  };
}

function categorizeSkill(source: string, alwaysEnabled: boolean): string {
  if (alwaysEnabled) {
    return "Always on";
  }
  if (source.includes("bundled")) {
    return "Built-in";
  }
  if (source.includes("managed")) {
    return "Installable";
  }
  if (source.includes("workspace")) {
    return "Workspace";
  }
  return "Optional";
}

export function resolveOnboardingSkills(report?: SkillStatusReport | null): OnboardingSkillState[] {
  if (report?.skills?.length) {
    return [...report.skills]
      .toSorted((left, right) => left.name.localeCompare(right.name))
      .map((skill) => ({
        id: skill.skillKey,
        name: skill.name,
        description: skill.description,
        installed: skill.always || !skill.disabled,
        category: categorizeSkill(skill.source, skill.always),
        installId: skill.install[0]?.id ?? null,
        canInstall: skill.always || skill.install.length > 0 || skill.eligible,
        alwaysEnabled: skill.always,
      }));
  }
  return [
    {
      id: "weather",
      name: "Weather",
      description: "Get current weather and forecasts in chat.",
      installed: false,
      category: "Recommended",
      installId: null,
      canInstall: true,
      alwaysEnabled: false,
    },
    {
      id: "summarize",
      name: "Summarize",
      description: "Summarize URLs, text, and documents without leaving the app.",
      installed: false,
      category: "Recommended",
      installId: null,
      canInstall: true,
      alwaysEnabled: false,
    },
    {
      id: "ddg-search",
      name: "Web Search",
      description: "Search the web from chat when you need fresh answers.",
      installed: false,
      category: "Recommended",
      installId: null,
      canInstall: true,
      alwaysEnabled: false,
    },
  ];
}

export function resolveOnboardingStepStatus(params: {
  activeStep: OnboardingStepId;
  config: Record<string, unknown> | null;
  gatewayUrl: string;
  channelsSnapshot: ChannelsStatusSnapshot | null;
}): Record<OnboardingStepId, OnboardingStepStatus> {
  const order: OnboardingStepId[] = [
    "welcome",
    "theme",
    "setup",
    "security",
    "workspace",
    "models",
    "channels",
    "skills",
    "complete",
  ];
  const activeIndex = order.indexOf(params.activeStep);
  const setup = resolveOnboardingSetup(params.config, params.gatewayUrl);
  const hasModel = hasConfiguredModel(params.config);
  const hasChannels = hasConfiguredChannels(params.channelsSnapshot);
  const completion: Record<OnboardingStepId, boolean> = {
    welcome: true,
    theme: true,
    setup: Boolean(setup.mode),
    security: true,
    workspace: true,
    models: hasModel,
    channels: hasChannels,
    skills: true,
    complete: true,
  };
  return order.reduce(
    (acc, step, index) => {
      if (index === activeIndex) {
        acc[step] = "current";
      } else if (completion[step] && index < activeIndex) {
        acc[step] = "complete";
      } else {
        acc[step] = "upcoming";
      }
      return acc;
    },
    {} as Record<OnboardingStepId, OnboardingStepStatus>,
  );
}
