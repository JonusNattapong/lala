import { html } from "lit";
import type { WizardStep } from "../../../src/wizard/session.js";

function renderStepInput(props: {
  step: WizardStep;
  textValue: string;
  booleanValue: boolean;
  multiValue: string[];
  onTextInput: (value: string) => void;
  onBooleanChange: (value: boolean) => void;
  onToggleMulti: (value: string) => void;
}) {
  const { step } = props;
  if (step.type === "text") {
    return html`
      <textarea
        class="input onboarding-wizard__text"
        .value=${props.textValue}
        placeholder=${step.placeholder ?? ""}
        @input=${(event: Event) =>
          props.onTextInput((event.currentTarget as HTMLTextAreaElement).value)}
      ></textarea>
    `;
  }
  if (step.type === "confirm") {
    return html`
      <label class="onboarding-wizard__confirm">
        <input
          type="checkbox"
          .checked=${props.booleanValue}
          @change=${(event: Event) =>
            props.onBooleanChange((event.currentTarget as HTMLInputElement).checked)}
        />
        <span>I confirm</span>
      </label>
    `;
  }
  if (step.type === "select") {
    return html`
      <div class="onboarding-detail-grid">
        ${(step.options ?? []).map(
          (option) => html`
            <button
              class="onboarding-detail-card onboarding-detail-card--button ${props.textValue === String(option.value)
                ? "is-selected"
                : ""}"
              @click=${() => props.onTextInput(String(option.value))}
            >
              <div class="onboarding-detail-card__value">${option.label}</div>
              ${option.hint ? html`<div class="onboarding-inline-subtle">${option.hint}</div>` : null}
            </button>
          `,
        )}
      </div>
    `;
  }
  if (step.type === "multiselect") {
    return html`
      <div class="onboarding-detail-grid">
        ${(step.options ?? []).map(
          (option) => {
            const selected = props.multiValue.includes(String(option.value));
            return html`
              <button
                class="onboarding-detail-card onboarding-detail-card--button ${selected ? "is-selected" : ""}"
                @click=${() => props.onToggleMulti(String(option.value))}
              >
                <div class="onboarding-detail-card__value">${option.label}</div>
                ${option.hint ? html`<div class="onboarding-inline-subtle">${option.hint}</div>` : null}
              </button>
            `;
          },
        )}
      </div>
    `;
  }
  return null;
}

export function renderOnboardingWizard(props: {
  sessionId: string;
  step: WizardStep | null;
  status: "running" | "done" | "cancelled" | "error" | null;
  error: string | null;
  busy: boolean;
  textValue: string;
  booleanValue: boolean;
  multiValue: string[];
  onTextInput: (value: string) => void;
  onBooleanChange: (value: boolean) => void;
  onToggleMulti: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onFinish: () => void;
}) {
  const title = props.step?.title ?? "Web onboarding";
  const message = props.step?.message ?? props.error ?? "Preparing onboarding...";
  const complete = props.status && props.status !== "running";
  const stepTypeLabel = props.step?.type ? props.step.type.replace(/-/g, " ") : "status";

  return html`
    <div class="onboarding-shell is-active">
      <div class="onboarding-shell__frame">
        <div class="onboarding-shell__header">
          <div class="onboarding-brand">
            <div>
              <div class="onboarding-brand__eyebrow">Shared onboarding engine</div>
              <div class="onboarding-brand__title">${title}</div>
            </div>
          </div>
          <button class="btn" @click=${complete ? props.onFinish : props.onCancel}>
            ${complete ? "Open dashboard" : "Cancel"}
          </button>
        </div>
        <div class="onboarding-step">
          <div class="onboarding-chip-group">
            <span class="onboarding-chip-group__label">Shared wizard session</span>
            <span class="onboarding-chip">${stepTypeLabel}</span>
            ${props.status ? html`<span class="onboarding-chip">${props.status}</span>` : null}
          </div>
          <div class="onboarding-copy-block">
            <div class="onboarding-copy-block__eyebrow">Session</div>
            <h1>${title}</h1>
            <p>${message}</p>
            <div class="onboarding-inline-subtle">Session: ${props.sessionId}</div>
          </div>

          ${props.step
            ? renderStepInput({
                step: props.step,
                textValue: props.textValue,
                booleanValue: props.booleanValue,
                multiValue: props.multiValue,
                onTextInput: props.onTextInput,
                onBooleanChange: props.onBooleanChange,
                onToggleMulti: props.onToggleMulti,
              })
            : null}

          ${props.step?.type === "note"
            ? html`
                <div class="onboarding-note-card">
                  <div>
                    <strong>Wizard note</strong>
                    <div class="onboarding-inline-subtle">
                      This step comes from the shared onboarding engine and matches the CLI flow.
                    </div>
                  </div>
                </div>
              `
            : null}

          ${props.error ? html`<div class="onboarding-note-card"><div><strong>Error:</strong> ${props.error}</div></div>` : null}

          <div class="onboarding-actions">
            ${complete
              ? html`<button class="btn primary" @click=${props.onFinish}>Open dashboard</button>`
              : html`<button class="btn primary" ?disabled=${props.busy} @click=${props.onSubmit}>
                  ${props.busy ? "Working..." : props.step?.type === "note" ? "Continue" : "Submit"}
                </button>`}
          </div>
        </div>
      </div>
    </div>
  `;
}
