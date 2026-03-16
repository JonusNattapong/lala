import { html } from "lit";
import { icons } from "../icons.ts";
import type { OnboardingSkillState } from "./onboarding-flow.ts";

export function renderOnboardingSkillsStep(props: {
  skills: OnboardingSkillState[];
  selectedSkills: string[];
  saving: boolean;
  onSkillToggle: (skillId: string) => void;
  onSave: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const categories = [...new Set(props.skills.map((s) => s.category))];
  const selectedCount = props.selectedSkills.length;

  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">Skills</div>
        <h1>Add capabilities to your agent.</h1>
        <p>
          Skills extend what Lala can do. Pick a few helpful ones now and you can always add more
          later from the Skills screen.
        </p>
      </div>

      <div class="onboarding-chip-group">
        <span class="onboarding-chip-group__label">Selected:</span>
        <span class="onboarding-chip">${selectedCount} skills</span>
      </div>

      ${categories.map(
        (category) => html`
          <div style="margin-top: 16px;">
            <div class="onboarding-detail-card__label" style="margin-bottom: 12px;">${category}</div>
            <div class="onboarding-choice-grid">
              ${props.skills
                .filter((s) => s.category === category)
                .map(
                  (skill) => html`
                    <label
                      class="onboarding-choice-card ${props.selectedSkills.includes(skill.id) ? "is-selected" : ""}"
                      style="cursor: pointer;"
                    >
                      <div class="onboarding-choice-card__content">
                        <div class="onboarding-choice-card__title-row">
                          <h2>${skill.name}</h2>
                          <span class="onboarding-choice-card__badge">
                            ${skill.installed ? "Ready" : skill.canInstall ? "Install" : "Manual"}
                          </span>
                        </div>
                        <p>${skill.description}</p>
                        <div class="onboarding-inline-subtle">
                          ${skill.alwaysEnabled
                            ? "Always enabled"
                            : skill.installed
                              ? "Currently available"
                              : skill.canInstall
                                ? "Will be installed or enabled when you apply changes"
                                : "Needs extra setup from the Skills screen"}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        .checked=${props.selectedSkills.includes(skill.id)}
                        @change=${() => props.onSkillToggle(skill.id)}
                      />
                    </label>
                  `,
                )}
            </div>
          </div>
        `,
      )}

      <div class="onboarding-note-card" style="margin-top: 24px;">
        <div class="onboarding-note-card__icon">${icons.search}</div>
        <div>
          <strong>Looking for more?</strong>
          <p>After setup, the Skills screen gives you the full catalog and install controls.</p>
        </div>
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn" ?disabled=${props.saving} @click=${props.onSave}>
          ${props.saving ? "Applying..." : "Apply selected skills"}
        </button>
        <button class="btn primary" @click=${props.onNext}>Continue</button>
      </div>
    </section>
  `;
}
