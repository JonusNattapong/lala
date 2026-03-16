/* @vitest-environment jsdom */

import { render } from "lit";
import { describe, expect, it, vi } from "vitest";
import type { AppViewState } from "../app-view-state.ts";
import { renderOnboardingView, resolveShouldShowOnboarding } from "./onboarding-view.ts";
import { resolveOnboardingSetup } from "./onboarding-flow.ts";

describe("onboarding visibility", () => {
  it("shows onboarding for a missing config file", () => {
    expect(
      resolveShouldShowOnboarding({
        forced: false,
        dismissed: false,
        connected: true,
        configSnapshot: { exists: false, valid: true, config: {} },
        configForm: null,
        channelsSnapshot: null,
      }),
    ).toBe(true);
  });

  it("stays hidden once a model is configured", () => {
    expect(
      resolveShouldShowOnboarding({
        forced: false,
        dismissed: false,
        connected: true,
        configSnapshot: {
          exists: true,
          valid: true,
          config: { agents: { defaults: { model: "gpt-5-mini" } } },
        },
        configForm: null,
        channelsSnapshot: null,
      }),
    ).toBe(false);
  });
});

describe("onboarding view", () => {
  it("maps remote gateway config into the setup step", () => {
    expect(
      resolveOnboardingSetup(
        {
          gateway: {
            bind: "tailnet",
            port: 18789,
            auth: { mode: "token" },
            remote: { url: "wss://lala.example/ws" },
          },
        },
        "wss://lala.example/ws",
      ),
    ).toMatchObject({ mode: "remote", bind: "tailnet", authMode: "token", port: 18789 });
  });

  it("renders the models step copy and action", () => {
    const container = document.createElement("div");
    const state = {
      settings: { gatewayUrl: "ws://127.0.0.1:18789", themeMode: "dark", theme: "lala" },
      configSnapshot: { config: {} },
      channelsSnapshot: null,
    } as unknown as AppViewState;

    render(
      renderOnboardingView({
        state,
        active: true,
        step: "models",
        selectedProvider: "openai",
        selectedModelId: null,
        models: [{ id: "gpt-5-mini", name: "GPT-5 Mini", provider: "openai" }],
        modelSaving: false,
        selectedTheme: "system",
        selectedSkills: [],
        skillsSaving: false,
        securityConfig: { toolProfile: "coding", sandboxMode: false },
        workspaceConfig: { path: null, personality: null, autoSave: true },
        onStepChange: vi.fn(),
        onProviderChange: vi.fn(),
        onModelChange: vi.fn(),
        onSaveModel: vi.fn(),
        onOpenAiSettings: vi.fn(),
        onOpenInfrastructureSettings: vi.fn(),
        onOpenChannelSettings: vi.fn(),
        onThemeChange: vi.fn(),
        onSkillToggle: vi.fn(),
        onSkillsSave: vi.fn(),
        onSecurityChange: vi.fn(),
        onWorkspaceChange: vi.fn(),
        onFinish: vi.fn(),
        onSkip: vi.fn(),
        onOpenDashboard: vi.fn(),
        onStartTutorial: vi.fn(),
      }),
      container,
    );

    expect(container.textContent).toContain("Pick the model you want to start with.");
    expect(container.textContent).toContain("GPT-5 Mini");
    expect(container.textContent).toContain("Open AI settings");
  });
});
