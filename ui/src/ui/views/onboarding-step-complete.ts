import { html } from "lit";
import { icons } from "../icons.ts";
import type { ChannelsStatusSnapshot } from "../types.ts";
import { hasConfiguredChannels, hasConfiguredModel } from "./onboarding-flow.ts";

export function renderOnboardingCompleteStep(props: {
  config: Record<string, unknown> | null;
  channelsSnapshot: ChannelsStatusSnapshot | null;
  onOpenDashboard: () => void;
  onStartTutorial: () => void;
  onBack: () => void;
}) {
  const hasModel = hasConfiguredModel(props.config);
  const hasChannels = hasConfiguredChannels(props.channelsSnapshot);

  const checklist = [
    { label: "Gateway configured", complete: true },
    { label: "AI model selected", complete: hasModel },
    { label: "Channels connected", complete: hasChannels },
    { label: "Skills installed", complete: true },
  ];

  const nextSteps = [
    {
      icon: icons.messageSquare,
      title: "Start chatting",
      description: "Open chat and send your first message.",
    },
    {
      icon: icons.settings,
      title: "Fine-tune settings",
      description: "Adjust models, tools, channels, and preferences whenever you want.",
    },
    {
      icon: icons.book,
      title: "Read the docs",
      description: "Come back for advanced features once the basics feel comfortable.",
    },
  ];

  return html`
    <section class="onboarding-step onboarding-step--welcome">
      <div class="onboarding-hero" style="text-align: center;">
        <div class="onboarding-hero__glow onboarding-hero__glow--one"></div>
        <div class="onboarding-hero__glow onboarding-hero__glow--two"></div>
        <div
          style="width: 80px; height: 80px; margin: 0 auto 24px; border-radius: 24px; background: linear-gradient(135deg, var(--accent), var(--accent-2)); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px;"
        >
          ✓
        </div>
        <div class="onboarding-hero__eyebrow">Setup complete</div>
        <h1 class="onboarding-hero__title">You're all set!</h1>
        <p class="onboarding-hero__copy">
          Lala is configured and ready to help. Here is a quick recap of what is ready now:
        </p>
      </div>

      <div class="onboarding-detail-grid" style="grid-template-columns: repeat(4, 1fr);">
        ${checklist.map(
          (item) => html`
            <div class="onboarding-detail-card" style="text-align: center;">
              <div
                style="width: 40px; height: 40px; margin: 0 auto 12px; border-radius: 12px; background: ${item.complete
                  ? "color-mix(in srgb, var(--accent) 14%, transparent)"
                  : "var(--bg-elev)"}; color: ${item.complete
                  ? "var(--accent)"
                  : "var(--muted)"}; display: flex; align-items: center; justify-content: center; font-size: 20px;"
              >
                ${item.complete ? "✓" : "○"}
              </div>
              <div class="onboarding-detail-card__value" style="font-size: 14px;">${item.label}</div>
            </div>
          `,
        )}
      </div>

      <div class="onboarding-copy-block" style="margin-top: 8px;">
        <h2>What's next?</h2>
      </div>

      <div class="onboarding-highlight-grid">
        ${nextSteps.map(
          (step, index) => html`
            <article class="onboarding-highlight-card" style="${`animation-delay:${index * 80}ms`}">
              <div class="onboarding-highlight-card__icon">${step.icon}</div>
              <h2>${step.title}</h2>
              <p>${step.description}</p>
            </article>
          `,
        )}
      </div>

      <div class="onboarding-note-card">
        <div class="onboarding-note-card__icon">${icons.monitor}</div>
        <div>
          <strong>Guided tour</strong>
          <div class="onboarding-inline-subtle">
            We can open the dashboard first so you can explore the main surfaces in a safe order:
            Overview, AI settings, channels, then chat.
          </div>
        </div>
      </div>

      <div class="onboarding-actions" style="justify-content: center; margin-top: 32px;">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn" @click=${props.onStartTutorial}>Take a tour</button>
        <button class="btn primary onboarding-cta" @click=${props.onOpenDashboard}>Open dashboard</button>
      </div>
    </section>
  `;
}
