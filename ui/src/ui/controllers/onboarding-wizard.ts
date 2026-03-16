import type { WizardNextResult, WizardStep } from "../../../src/wizard/session.js";

type OnboardingWizardState = {
  client: { request: <T>(method: string, params?: Record<string, unknown>) => Promise<T> } | null;
  connected: boolean;
  onboardingWizardSessionId: string | null;
  onboardingWizardStep: WizardStep | null;
  onboardingWizardStatus: "running" | "done" | "cancelled" | "error" | null;
  onboardingWizardError: string | null;
  onboardingWizardBusy: boolean;
  onboardingWizardStarted: boolean;
  onboardingWizardAnswerText: string;
  onboardingWizardAnswerBoolean: boolean;
  onboardingWizardAnswerMulti: string[];
};

export function resolveWizardSessionIdFromUrl(): string | null {
  if (!window.location.search) {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("wizardSessionId")?.trim();
  return sessionId || null;
}

function applyStepDefaults(state: OnboardingWizardState, step: WizardStep | null) {
  if (!step) {
    state.onboardingWizardAnswerText = "";
    state.onboardingWizardAnswerBoolean = false;
    state.onboardingWizardAnswerMulti = [];
    return;
  }
  if (step.type === "text" || step.type === "select") {
    state.onboardingWizardAnswerText = typeof step.initialValue === "string" ? step.initialValue : "";
  } else if (step.type === "confirm") {
    state.onboardingWizardAnswerBoolean = Boolean(step.initialValue);
  } else if (step.type === "multiselect") {
    state.onboardingWizardAnswerMulti = Array.isArray(step.initialValue)
      ? step.initialValue.map((value) => String(value))
      : [];
  }
}

function applyResult(state: OnboardingWizardState, result: WizardNextResult) {
  state.onboardingWizardStatus = result.status;
  state.onboardingWizardError = result.error ?? null;
  state.onboardingWizardStep = result.step ?? null;
  applyStepDefaults(state, result.step ?? null);
}

export async function loadOnboardingWizard(state: OnboardingWizardState) {
  if (!state.client || !state.connected || !state.onboardingWizardSessionId || state.onboardingWizardBusy) {
    return;
  }
  state.onboardingWizardBusy = true;
  try {
    const result = await state.client.request<WizardNextResult>("wizard.next", {
      sessionId: state.onboardingWizardSessionId,
    });
    state.onboardingWizardStarted = true;
    applyResult(state, result);
  } catch (error) {
    state.onboardingWizardError = error instanceof Error ? error.message : String(error);
    state.onboardingWizardStatus = "error";
  } finally {
    state.onboardingWizardBusy = false;
  }
}

export async function submitOnboardingWizardStep(state: OnboardingWizardState) {
  const step = state.onboardingWizardStep;
  if (!state.client || !state.connected || !state.onboardingWizardSessionId || !step) {
    return;
  }
  let value: unknown;
  if (step.type === "text" || step.type === "select") {
    value = state.onboardingWizardAnswerText;
  } else if (step.type === "confirm") {
    value = state.onboardingWizardAnswerBoolean;
  } else if (step.type === "multiselect") {
    value = state.onboardingWizardAnswerMulti;
  }
  state.onboardingWizardBusy = true;
  try {
    const isAckStep = step.type === "note" || step.type === "action" || step.type === "progress";
    const result = await state.client.request<WizardNextResult>("wizard.next", {
      sessionId: state.onboardingWizardSessionId,
      answer: {
        stepId: step.id,
        value: isAckStep ? undefined : value,
      },
    });
    applyResult(state, result);
  } catch (error) {
    state.onboardingWizardError = error instanceof Error ? error.message : String(error);
    state.onboardingWizardStatus = "error";
  } finally {
    state.onboardingWizardBusy = false;
  }
}

export async function cancelOnboardingWizard(state: OnboardingWizardState) {
  if (!state.client || !state.connected || !state.onboardingWizardSessionId || state.onboardingWizardBusy) {
    return;
  }
  state.onboardingWizardBusy = true;
  try {
    await state.client.request("wizard.cancel", {
      sessionId: state.onboardingWizardSessionId,
    });
    state.onboardingWizardStatus = "cancelled";
    state.onboardingWizardStep = null;
  } catch (error) {
    state.onboardingWizardError = error instanceof Error ? error.message : String(error);
    state.onboardingWizardStatus = "error";
  } finally {
    state.onboardingWizardBusy = false;
  }
}
