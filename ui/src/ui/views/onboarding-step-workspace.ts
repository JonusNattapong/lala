import { html } from "lit";

export function renderOnboardingWorkspaceStep(props: {
  config: { path: string | null; personality: string | null; autoSave: boolean };
  onConfigChange: (config: { path: string | null; personality: string | null; autoSave: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">Workspace</div>
        <h1>Decide where Lala should keep its working files.</h1>
        <p>
          Your workspace is the default folder for projects, notes, and generated files. You can
          keep the suggested path or point Lala at an existing folder.
        </p>
      </div>

      <div class="onboarding-detail-grid" style="grid-template-columns: 1fr;">
        <div class="onboarding-detail-card">
          <div class="onboarding-detail-card__label">Workspace Path</div>
          <div style="display: flex; gap: 12px; margin-top: 8px;">
            <input
              type="text"
              class="onboarding-wizard__text"
              style="min-height: 48px; flex: 1;"
              placeholder="~/lala-workspace"
              .value=${props.config.path ?? ""}
              @input=${(e: Event) => {
                const value = (e.target as HTMLInputElement).value;
                props.onConfigChange({ ...props.config, path: value || null });
              }}
            />
          </div>
          <p class="onboarding-inline-subtle" style="margin-top: 8px;">
            Example: <code>~/.lala/workspace</code>
          </p>
        </div>

        <div class="onboarding-detail-card">
          <div class="onboarding-detail-card__label">Agent Personality</div>
          <textarea
            class="onboarding-wizard__text"
            style="min-height: 100px; width: 100%; margin-top: 8px;"
            placeholder="Optional: Describe how you want Lala to communicate (e.g., 'concise and professional' or 'friendly and casual')"
            .value=${props.config.personality ?? ""}
            @input=${(e: Event) => {
              const value = (e.target as HTMLTextAreaElement).value;
              props.onConfigChange({ ...props.config, personality: value || null });
            }}
          ></textarea>
          <p class="onboarding-inline-subtle" style="margin-top: 8px;">
            Optional. Use this to set the default tone, for example “concise and practical.”
          </p>
        </div>

        <label class="onboarding-detail-card" style="cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div class="onboarding-detail-card__label">Auto-save</div>
              <p class="onboarding-inline-subtle" style="margin-top: 4px;">
                Keep your setup changes and working context in sync automatically.
              </p>
            </div>
            <input
              type="checkbox"
              .checked=${props.config.autoSave}
              @change=${(e: Event) => {
                const checked = (e.target as HTMLInputElement).checked;
                props.onConfigChange({ ...props.config, autoSave: checked });
              }}
            />
          </div>
        </label>
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn primary" @click=${props.onNext}>Continue</button>
      </div>
    </section>
  `;
}
