import { html } from "lit";
import { icons } from "../icons.ts";
import type { OnboardingSetupState } from "./onboarding-flow.ts";

function formatMode(mode: "local" | "remote"): string {
  return mode === "local" ? "Local gateway" : "Remote gateway";
}

export function renderOnboardingSetupStep(props: {
  setup: OnboardingSetupState;
  onOpenInfrastructureSettings: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const rows = [
    { label: "CLI domain", value: "OnboardMode + GatewayBind + GatewayAuthChoice" },
    { label: "Current mode", value: formatMode(props.setup.mode) },
    { label: "Bind", value: props.setup.bind },
    { label: "Auth", value: props.setup.authMode },
    { label: "Port", value: props.setup.port == null ? "Not set" : String(props.setup.port) },
    {
      label: "Remote URL",
      value: props.setup.remoteUrl ?? "Not configured",
    },
    {
      label: "Workspace",
      value: props.setup.workspace ?? "Not configured yet",
    },
  ];

  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">Where Lala lives</div>
        <h1>This step now reflects the real gateway state.</h1>
        <p>
          In CLI and macOS onboarding this is where users choose local vs remote, bind mode, and
          gateway auth. In the web UI we surface the live values first, because changing them here
          can interrupt your current connection.
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
          <strong>Need to change gateway hosting details?</strong>
          <p>Open infrastructure settings for the full configuration controls.</p>
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
