import type { ChannelsStatusSnapshot, ModelCatalogEntry } from "../types.ts";
import { resolveModelPrimary } from "./agents-utils.ts";

export type OnboardingStepId = "welcome" | "setup" | "models" | "channels";

type AgentLikeConfig = {
  agents?: {
    defaults?: {
      model?: unknown;
      models?: Record<string, unknown>;
      workspace?: string;
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
  return [...providers].sort((a, b) => a.localeCompare(b));
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

export function resolveOnboardingStepStatus(params: {
  activeStep: OnboardingStepId;
  config: Record<string, unknown> | null;
  gatewayUrl: string;
  channelsSnapshot: ChannelsStatusSnapshot | null;
}): Record<OnboardingStepId, OnboardingStepStatus> {
  const order: OnboardingStepId[] = ["welcome", "setup", "models", "channels"];
  const activeIndex = order.indexOf(params.activeStep);
  const setup = resolveOnboardingSetup(params.config, params.gatewayUrl);
  const hasModel = hasConfiguredModel(params.config);
  const hasChannels = hasConfiguredChannels(params.channelsSnapshot);
  const completion: Record<OnboardingStepId, boolean> = {
    welcome: true,
    setup: Boolean(setup.mode),
    models: hasModel,
    channels: hasChannels,
  };
  return {
    welcome: activeIndex === 0 ? "current" : completion.welcome ? "complete" : "upcoming",
    setup: activeIndex === 1 ? "current" : completion.setup && activeIndex > 1 ? "complete" : "upcoming",
    models: activeIndex === 2 ? "current" : completion.models && activeIndex > 2 ? "complete" : "upcoming",
    channels: activeIndex === 3 ? "current" : completion.channels && activeIndex > 3 ? "complete" : "upcoming",
  };
}
