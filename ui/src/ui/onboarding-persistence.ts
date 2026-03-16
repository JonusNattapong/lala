const ONBOARDING_STORAGE_KEY = "lala_onboarding_progress";
const MAX_PROGRESS_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type OnboardingProgressStep =
  | "welcome"
  | "theme"
  | "setup"
  | "security"
  | "workspace"
  | "models"
  | "channels"
  | "skills"
  | "complete";

export type OnboardingProgress = {
  step: OnboardingProgressStep;
  theme: "light" | "dark" | "system";
  skills: string[];
  security: { toolProfile: "coding" | "full" | "minimal"; sandboxMode: boolean };
  workspace: { path: string | null; personality: string | null; autoSave: boolean };
  selectedProvider: string | null;
  selectedModelId: string | null;
  timestamp: number;
};

function isValidStep(value: unknown): value is OnboardingProgressStep {
  return (
    value === "welcome" ||
    value === "theme" ||
    value === "setup" ||
    value === "security" ||
    value === "workspace" ||
    value === "models" ||
    value === "channels" ||
    value === "skills" ||
    value === "complete"
  );
}

function normalizeProgress(raw: unknown): OnboardingProgress | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const value = raw as Partial<OnboardingProgress>;
  if (!isValidStep(value.step)) {
    return null;
  }
  if (value.theme !== "light" && value.theme !== "dark" && value.theme !== "system") {
    return null;
  }
  if (typeof value.timestamp !== "number" || !Number.isFinite(value.timestamp)) {
    return null;
  }
  return {
    step: value.step,
    theme: value.theme,
    skills: Array.isArray(value.skills) ? value.skills.filter((entry): entry is string => typeof entry === "string") : [],
    security: {
      toolProfile:
        value.security?.toolProfile === "full" || value.security?.toolProfile === "minimal"
          ? value.security.toolProfile
          : "coding",
      sandboxMode: Boolean(value.security?.sandboxMode),
    },
    workspace: {
      path: typeof value.workspace?.path === "string" && value.workspace.path.trim() ? value.workspace.path : null,
      personality:
        typeof value.workspace?.personality === "string" && value.workspace.personality.trim()
          ? value.workspace.personality
          : null,
      autoSave: value.workspace?.autoSave !== false,
    },
    selectedProvider:
      typeof value.selectedProvider === "string" && value.selectedProvider.trim()
        ? value.selectedProvider
        : null,
    selectedModelId:
      typeof value.selectedModelId === "string" && value.selectedModelId.trim()
        ? value.selectedModelId
        : null,
    timestamp: value.timestamp,
  };
}

export function saveOnboardingProgress(progress: Omit<OnboardingProgress, "timestamp">): void {
  try {
    const data: OnboardingProgress = { ...progress, timestamp: Date.now() };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function loadOnboardingProgress(): OnboardingProgress | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const data = normalizeProgress(JSON.parse(raw));
    if (!data) {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return null;
    }
    if (Date.now() - data.timestamp > MAX_PROGRESS_AGE_MS) {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearOnboardingProgress(): void {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
