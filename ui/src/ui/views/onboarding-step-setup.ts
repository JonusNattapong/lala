import { html } from "lit";
import { icons } from "../icons.ts";
import type { OnboardingSetupState } from "./onboarding-flow.ts";

function formatMode(mode: "local" | "remote"): string {
  return mode === "local" ? "This device" : "Another machine";
}

export function renderOnboardingSetupStep(props: {
  setup: OnboardingSetupState;
  onOpenInfrastructureSettings: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const rows = [
    { label: "Where Lala runs", value: formatMode(props.setup.mode) },
    { label: "Network access", value: props.setup.bind },
    { label: "Sign-in method", value: props.setup.authMode },
    { label: "Port", value: props.setup.port == null ? "Using default" : String(props.setup.port) },
    {
      label: "Remote address",
      value: props.setup.remoteUrl ?? "Not connected",
    },
    {
      label: "Workspace",
      value: props.setup.workspace ?? "Will be created when you finish setup",
    },
  ];

  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">Where Lala lives</div>
        <h1>Confirm where your assistant is running.</h1>
        <p>
          This guided web setup reads your live gateway settings first so you can confirm the basics
          without breaking the connection you are using right now.
        </p>
      </div>

      <div class="onboarding-note-card">
        <div class="onboarding-note-card__icon">${props.setup.mode === "local"
          ? icons.monitor
          : icons.globe}</div>
        <div>
          <strong>${formatMode(props.setup.mode)}</strong>
          ${props.setup.wizardLastRunMode
            ? html`<div class="onboarding-inline-subtle">
                Last onboarding run: ${props.setup.wizardLastRunMode}
              </div>`
            : null}
        </div>
      </div>

      <div class="onboarding-detail-grid">
        ${rows.map(
          (row) => html`
            <article class="onboarding-detail-card">
              <div class="onboarding-detail-card__label">${row.label}</div>
              <div class="onboarding-detail-card__value">${row.value}</div>
            </article>
          `,
        )}
      </div>

      <div class="onboarding-models-panel">
        <div>
          <strong>Need to change host, port, or login details?</strong>
          <p>Open infrastructure settings for the full connection controls.</p>
        </div>
        <button class="btn" @click=${props.onOpenInfrastructureSettings}>Open infrastructure</button>
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn primary" @click=${props.onNext}>Continue</button>
      </div>
    </section>
  `;
}
