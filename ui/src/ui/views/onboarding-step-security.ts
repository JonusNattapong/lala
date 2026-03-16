import { html } from "lit";
import { icons } from "../icons.ts";

export function renderOnboardingSecurityStep(props: {
  config: { toolProfile: "coding" | "full" | "minimal"; sandboxMode: boolean };
  onConfigChange: (config: { toolProfile: "coding" | "full" | "minimal"; sandboxMode: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const profiles = [
    {
      id: "coding" as const,
      label: "Coding",
      description: "File system and runtime tools only. Recommended for development.",
      icon: icons.fileCode,
    },
    {
      id: "full" as const,
      label: "Full Access",
      description: "All tools enabled. Use only on fully trusted machines.",
      icon: icons.zap,
    },
    {
      id: "minimal" as const,
      label: "Minimal",
      description: "Read-only tools. Safest for shared or untrusted environments.",
      icon: icons.fileText,
    },
  ];

  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">Security</div>
        <h1>Choose a safety level you are comfortable with.</h1>
        <p>
          Lala can work as a careful read-only assistant or as a hands-on coding helper. Start with
          the safest profile that still lets you get value.
        </p>
      </div>

      <div class="onboarding-copy-block">
        <h2>Tool Profile</h2>
        <p>Select the default tool access level for your agent.</p>
      </div>

      <div class="onboarding-choice-grid">
        ${profiles.map(
          (profile) => html`
            <button
              class="onboarding-choice-card ${props.config.toolProfile === profile.id ? "is-selected" : ""}"
              @click=${() => props.onConfigChange({ ...props.config, toolProfile: profile.id })}
            >
              <div class="onboarding-choice-card__icon">${profile.icon}</div>
              <div class="onboarding-choice-card__content">
                <div class="onboarding-choice-card__title-row">
                  <h2>${profile.label}</h2>
                  ${props.config.toolProfile === profile.id
                    ? html`<span class="onboarding-choice-card__badge">Selected</span>`
                    : null}
                </div>
                <p>${profile.description}</p>
              </div>
            </button>
          `,
        )}
      </div>

      <div class="onboarding-note-card">
        <div class="onboarding-note-card__icon">${icons.zap}</div>
        <div>
          <strong>Sandbox untrusted sessions</strong>
          <div class="onboarding-inline-subtle">
            Keep risky work isolated for non-main sessions so experiments and shared inboxes stay
            safer.
          </div>
        </div>
        <label class="onboarding-wizard__confirm">
          <input
            type="checkbox"
            .checked=${props.config.sandboxMode}
            @change=${(e: Event) => {
              const checked = (e.target as HTMLInputElement).checked;
              props.onConfigChange({ ...props.config, sandboxMode: checked });
            }}
          />
          <span>Enable</span>
        </label>
      </div>

      <div class="onboarding-detail-grid">
        <article class="onboarding-detail-card">
          <div class="onboarding-detail-card__label">Good default</div>
          <div class="onboarding-detail-card__value">Coding + sandbox</div>
          <div class="onboarding-inline-subtle">
            Best fit for most personal setups that still need file and terminal help.
          </div>
        </article>
        <article class="onboarding-detail-card">
          <div class="onboarding-detail-card__label">Shared or cautious setup</div>
          <div class="onboarding-detail-card__value">Minimal + sandbox</div>
          <div class="onboarding-inline-subtle">
            Good when you are trying Lala carefully or expect less trusted input.
          </div>
        </article>
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn primary" @click=${props.onNext}>Continue</button>
      </div>
    </section>
  `;
}
