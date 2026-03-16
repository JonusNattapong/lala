/* @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from "vitest";
import {
  clearOnboardingProgress,
  loadOnboardingProgress,
  saveOnboardingProgress,
} from "./onboarding-persistence.ts";

describe("onboarding persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and restores onboarding progress", () => {
    saveOnboardingProgress({
      step: "skills",
      theme: "dark",
      skills: ["weather"],
      security: { toolProfile: "coding", sandboxMode: true },
      workspace: { path: "~/.lala/workspace", personality: "friendly", autoSave: true },
      selectedProvider: "openai",
      selectedModelId: "gpt-5-mini",
    });

    expect(loadOnboardingProgress()).toMatchObject({
      step: "skills",
      theme: "dark",
      skills: ["weather"],
      selectedProvider: "openai",
      selectedModelId: "gpt-5-mini",
    });
  });

  it("drops stale progress", () => {
    localStorage.setItem(
      "lala_onboarding_progress",
      JSON.stringify({
        step: "welcome",
        theme: "system",
        skills: [],
        security: { toolProfile: "coding", sandboxMode: false },
        workspace: { path: null, personality: null, autoSave: true },
        selectedProvider: null,
        selectedModelId: null,
        timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
      }),
    );

    expect(loadOnboardingProgress()).toBeNull();
  });

  it("clears onboarding progress", () => {
    saveOnboardingProgress({
      step: "welcome",
      theme: "system",
      skills: [],
      security: { toolProfile: "coding", sandboxMode: false },
      workspace: { path: null, personality: null, autoSave: true },
      selectedProvider: null,
      selectedModelId: null,
    });

    clearOnboardingProgress();

    expect(loadOnboardingProgress()).toBeNull();
  });
});
