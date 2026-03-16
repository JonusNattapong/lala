import { html, nothing } from "lit";
import { renderThemeToggle } from "../app-render.helpers.ts";
import type { AppViewState } from "../app-view-state.ts";
import { icons } from "../icons.ts";
import type { ModelCatalogEntry } from "../types.ts";
import {
  resolveConfiguredModel,
  resolveOnboardingChannels,
  resolveOnboardingModelsForProvider,
  resolveOnboardingProviders,
  resolveOnboardingSetup,
  resolveOnboardingSkills,
  resolveOnboardingStepStatus,
  resolveShouldShowOnboarding,
  type OnboardingStepId,
} from "./onboarding-flow.ts";
import { renderOnboardingChannelsStep } from "./onboarding-step-channels.ts";
import { renderOnboardingCompleteStep } from "./onboarding-step-complete.ts";
import { renderOnboardingModelsStep } from "./onboarding-step-models.ts";
import { renderOnboardingSecurityStep } from "./onboarding-step-security.ts";
import { renderOnboardingSetupStep } from "./onboarding-step-setup.ts";
import { renderOnboardingSkillsStep } from "./onboarding-step-skills.ts";
import { renderOnboardingThemeStep } from "./onboarding-step-theme.ts";
import { renderOnboardingWelcomeStep } from "./onboarding-step-welcome.ts";
import { renderOnboardingWorkspaceStep } from "./onboarding-step-workspace.ts";

const STEPS: Array<{ id: OnboardingStepId; label: string }> = [
  { id: "welcome", label: "Welcome" },
  { id: "theme", label: "Theme" },
  { id: "setup", label: "Home" },
  { id: "security", label: "Security" },
  { id: "workspace", label: "Workspace" },
  { id: "models", label: "Models" },
  { id: "channels", label: "Channels" },
  { id: "skills", label: "Skills" },
  { id: "complete", label: "Complete" },
];

export { resolveShouldShowOnboarding };
export type { OnboardingStepId };

export function renderOnboardingView(props: {
  state: AppViewState;
  active: boolean;
  step: OnboardingStepId;
  selectedProvider: string | null;
  selectedModelId: string | null;
  models: ModelCatalogEntry[];
  modelSaving: boolean;
  selectedTheme: "light" | "dark" | "system";
  selectedSkills: string[];
  skillsSaving: boolean;
  securityConfig: { toolProfile: "coding" | "full" | "minimal"; sandboxMode: boolean };
  workspaceConfig: { path: string | null; personality: string | null; autoSave: boolean };
  onStepChange: (step: OnboardingStepId) => void;
  onProviderChange: (provider: string) => void;
  onModelChange: (modelId: string) => void;
  onSaveModel: () => void;
  onOpenAiSettings: () => void;
  onOpenInfrastructureSettings: () => void;
  onOpenChannelSettings: () => void;
  onThemeChange: (theme: "light" | "dark" | "system") => void;
  onSkillToggle: (skillId: string) => void;
  onSkillsSave: () => void;
  onSecurityChange: (config: { toolProfile: "coding" | "full" | "minimal"; sandboxMode: boolean }) => void;
  onWorkspaceChange: (config: { path: string | null; personality: string | null; autoSave: boolean }) => void;
  onFinish: () => void;
  onSkip: () => void;
  onOpenDashboard: () => void;
  onStartTutorial: () => void;
}) {
  const stepIndex = Math.max(
    0,
    STEPS.findIndex((step) => step.id === props.step),
  );
  const nextStep = () => {
    const next = STEPS[Math.min(stepIndex + 1, STEPS.length - 1)];
    props.onStepChange(next.id);
  };
  const prevStep = () => {
    const next = STEPS[Math.max(stepIndex - 1, 0)];
    props.onStepChange(next.id);
  };

  const config = props.state.configForm ?? props.state.configSnapshot?.config ?? null;
  const setup = resolveOnboardingSetup(config, props.state.settings.gatewayUrl);
  const providers = resolveOnboardingProviders(props.models);
  const currentModel = resolveConfiguredModel(config);
  const selectedProvider =
    props.selectedProvider ??
    (currentModel ? currentModel.split("/")[0] : null) ??
    providers[0] ??
    null;
  const visibleModels = resolveOnboardingModelsForProvider(props.models, selectedProvider);
  const selectedModelId = props.selectedModelId ?? currentModel;
  const channels = resolveOnboardingChannels(props.state.channelsSnapshot);
  const stepStatus = resolveOnboardingStepStatus({
    activeStep: props.step,
    config,
    gatewayUrl: props.state.settings.gatewayUrl,
    channelsSnapshot: props.state.channelsSnapshot,
  });

  let content: unknown = nothing;
  if (props.step === "welcome") {
    content = renderOnboardingWelcomeStep({ onNext: nextStep, onSkip: props.onSkip });
  } else if (props.step === "theme") {
    content = renderOnboardingThemeStep({
      selectedTheme: props.selectedTheme,
      onThemeChange: props.onThemeChange,
      onNext: nextStep,
      onBack: prevStep,
    });
  } else if (props.step === "setup") {
    content = renderOnboardingSetupStep({
      setup,
      onOpenInfrastructureSettings: props.onOpenInfrastructureSettings,
      onNext: nextStep,
      onBack: prevStep,
    });
  } else if (props.step === "security") {
    content = renderOnboardingSecurityStep({
      config: props.securityConfig,
      onConfigChange: props.onSecurityChange,
      onNext: nextStep,
      onBack: prevStep,
    });
  } else if (props.step === "workspace") {
    content = renderOnboardingWorkspaceStep({
      config: props.workspaceConfig,
      onConfigChange: props.onWorkspaceChange,
      onNext: nextStep,
      onBack: prevStep,
    });
  } else if (props.step === "models") {
    content = renderOnboardingModelsStep({
      providers,
      models: visibleModels,
      selectedProvider,
      selectedModelId,
      currentModel,
      saving: props.modelSaving,
      onSelectProvider: props.onProviderChange,
      onSelectModel: props.onModelChange,
      onSaveModel: props.onSaveModel,
      onOpenAiSettings: props.onOpenAiSettings,
      onNext: nextStep,
      onBack: prevStep,
    });
  } else if (props.step === "channels") {
    content = renderOnboardingChannelsStep({
      channels,
      onOpenChannelSettings: props.onOpenChannelSettings,
      onBack: prevStep,
      onNext: nextStep,
    });
  } else if (props.step === "skills") {
    content = renderOnboardingSkillsStep({
      skills: resolveOnboardingSkills(props.state.skillsReport),
      selectedSkills: props.selectedSkills,
      saving: props.skillsSaving,
      onSkillToggle: props.onSkillToggle,
      onSave: props.onSkillsSave,
      onBack: prevStep,
      onNext: nextStep,
    });
  } else {
    content = renderOnboardingCompleteStep({
      config: props.state.configSnapshot?.config ?? null,
      channelsSnapshot: props.state.channelsSnapshot,
      onOpenDashboard: props.onOpenDashboard,
      onStartTutorial: props.onStartTutorial,
      onBack: prevStep,
    });
  }

  return html`
    <div class="onboarding-shell ${props.active ? "is-active" : ""}">
      <div class="onboarding-shell__theme">${renderThemeToggle(props.state)}</div>
      <div class="onboarding-shell__frame">
        <div class="onboarding-shell__header">
          <div class="onboarding-brand">
            <div class="onboarding-brand__mark">${icons.zap}</div>
            <div>
              <div class="onboarding-brand__eyebrow">Lala onboarding</div>
              <div class="onboarding-brand__title">Guided web setup</div>
            </div>
          </div>
          <button class="btn" @click=${props.onSkip}>Open dashboard</button>
        </div>

        <div class="onboarding-progress" role="list" aria-label="Setup progress">
          ${STEPS.map(
            (step, index) => html`
              <button
                role="listitem"
                class="onboarding-progress__step ${stepStatus[step.id] === "complete" ? "is-complete" : ""} ${index <= stepIndex ? "is-active" : ""} ${props.step === step.id ? "is-current" : ""}"
                @click=${() => props.onStepChange(step.id)}
              >
                <span class="onboarding-progress__dot">${stepStatus[step.id] === "complete"
                  ? "✓"
                  : index + 1}</span>
                <span>${step.label}</span>
              </button>
            `,
          )}
        </div>

        <div class="onboarding-shell__body">${content}</div>
      </div>
    </div>
  `;
}
