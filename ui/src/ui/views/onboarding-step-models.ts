import { html } from "lit";
import type { ModelCatalogEntry } from "../types.ts";

function formatProvider(provider: string): string {
  return provider
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

export function renderOnboardingModelsStep(props: {
  providers: string[];
  models: ModelCatalogEntry[];
  selectedProvider: string | null;
  selectedModelId: string | null;
  currentModel: string | null;
  saving: boolean;
  onSelectProvider: (provider: string) => void;
  onSelectModel: (modelId: string) => void;
  onSaveModel: () => void;
  onNext: () => void;
  onBack: () => void;
  onOpenAiSettings: () => void;
}) {
  const hasUnsavedSelection = Boolean(
    props.selectedModelId && props.selectedModelId !== props.currentModel,
  );

  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">The brain</div>
        <h1>AuthChoice becomes a model decision here.</h1>
        <p>
          The CLI flow asks for provider auth, then picks a default model. This web step now mirrors
          that outcome by showing your detected providers and letting you save the actual default
          model into config.
        </p>
      </div>

      <div class="onboarding-chip-group">
        <span class="onboarding-chip-group__label">CLI domain:</span>
        <span class="onboarding-chip">AuthChoice</span>
        <span class="onboarding-chip">default model</span>
      </div>

      <div class="onboarding-choice-grid">
        ${props.providers.map(
          (provider) => html`
            <button
              class="onboarding-choice-card onboarding-choice-card--provider ${props.selectedProvider === provider
                ? "is-selected"
                : ""}"
              @click=${() => props.onSelectProvider(provider)}
            >
              <div class="onboarding-choice-card__content">
                <div class="onboarding-choice-card__title-row">
                  <h2>${formatProvider(provider)}</h2>
                  ${props.selectedProvider === provider
                    ? html`<span class="onboarding-choice-card__badge">Selected</span>`
                    : null}
                </div>
                <p>${provider}</p>
              </div>
            </button>
          `,
        )}
      </div>

      ${props.models.length > 0
        ? html`
            <div class="onboarding-detail-grid">
              ${props.models.map(
                (model) => html`
                  <button
                    class="onboarding-detail-card onboarding-detail-card--button ${props.selectedModelId === model.id
                      ? "is-selected"
                      : ""}"
                    @click=${() => props.onSelectModel(model.id)}
                  >
                    <div class="onboarding-detail-card__label">${model.provider}</div>
                    <div class="onboarding-detail-card__value">${model.name ?? model.id}</div>
                    <div class="onboarding-inline-subtle">${model.id}</div>
                  </button>
                `,
              )}
            </div>
          `
        : html`
            <div class="onboarding-note-card">
              <div>
                <strong>No models detected yet.</strong> Add provider credentials in AI settings first.
              </div>
            </div>
          `}

      <div class="onboarding-models-panel">
        <div>
          <strong>Current default:</strong>
          <p>${props.currentModel ?? "No default model configured yet."}</p>
        </div>
        <button class="btn" @click=${props.onOpenAiSettings}>Open AI settings</button>
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        ${hasUnsavedSelection
          ? html`
              <button class="btn" ?disabled=${props.saving} @click=${props.onSaveModel}>
                ${props.saving ? "Saving..." : "Save model"}
              </button>
            `
          : null}
        <button class="btn primary" @click=${props.onNext}>Continue</button>
      </div>
    </section>
  `;
}
