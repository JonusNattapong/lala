import type { OnboardOptions } from "../commands/onboard-types.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "./prompts.js";
import { runOnboardingWizard } from "./onboarding.js";

// Shared onboarding entry point used by CLI and web-driven wizard sessions.
// The wizard implementation remains prompt-driven, but the execution surface is
// centralized here so different renderers do not import the CLI flow directly.
export async function runOnboardingEngine(
  opts: OnboardOptions,
  runtime: RuntimeEnv,
  prompter: WizardPrompter,
) {
  await runOnboardingWizard(opts, runtime, prompter);
}
