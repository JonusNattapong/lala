import { html } from "lit";
import { icons } from "../icons.ts";

export function renderOnboardingThemeStep(props: {
  selectedTheme: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const themes = [
    {
      id: "light" as const,
      label: "Light",
      description: "Clean and bright interface",
      icon: icons.sun,
    },
    {
      id: "dark" as const,
      label: "Dark",
      description: "Easy on the eyes, perfect for night",
      icon: icons.moon,
    },
    {
      id: "system" as const,
      label: "System",
      description: "Follow your OS preference",
      icon: icons.monitor,
    },
  ];

  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">Appearance</div>
        <h1>Choose your theme.</h1>
        <p>Select a visual style that works best for you. You can always change this later in settings.</p>
      </div>

      <div class="onboarding-choice-grid">
        ${themes.map(
          (theme) => html`
            <button
              class="onboarding-choice-card onboarding-choice-card--theme ${props.selectedTheme === theme.id
                ? "is-selected"
                : ""}"
              @click=${() => props.onThemeChange(theme.id)}
            >
              <div class="onboarding-choice-card__icon">${theme.icon}</div>
              <div class="onboarding-choice-card__content">
                <div class="onboarding-choice-card__title-row">
                  <h2>${theme.label}</h2>
                  ${props.selectedTheme === theme.id
                    ? html`<span class="onboarding-choice-card__badge">Selected</span>`
                    : null}
                </div>
                <p>${theme.description}</p>
              </div>
            </button>
          `,
        )}
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn primary" @click=${props.onNext}>Continue</button>
      </div>
    </section>
  `;
}
