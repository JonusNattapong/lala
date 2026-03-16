import { html } from "lit";
import { icons } from "../icons.ts";

export function renderOnboardingWelcomeStep(props: {
  onNext: () => void;
  onSkip: () => void;
}) {
  const highlights = [
    {
      icon: icons.brain,
      title: "Personal agent, not a blank bot",
      body: "Shape how Lala thinks, speaks, and helps before you ever send the first message.",
    },
    {
      icon: icons.monitor,
      title: "Lives on your setup",
      body: "Keep the heavy lifting on the device or server you trust, with the web app as your control room.",
    },
    {
      icon: icons.radio,
      title: "Channels when you are ready",
      body: "Start simple in chat, then add Telegram, Discord, Slack, or other channels at your own pace.",
    },
  ];

  return html`
    <section class="onboarding-step onboarding-step--welcome">
      <div class="onboarding-hero">
        <div class="onboarding-hero__glow onboarding-hero__glow--one"></div>
        <div class="onboarding-hero__glow onboarding-hero__glow--two"></div>
        <div class="onboarding-hero__eyebrow">First run</div>
        <h1 class="onboarding-hero__title">Meet your own AI control room.</h1>
        <p class="onboarding-hero__copy">
          We will guide you through the essentials so Lala feels polished and ready without a wall
          of technical settings. If you ever want the full prompt-by-prompt wizard, you can still
          run <code>lala onboard</code> in the terminal.
        </p>
        <div class="onboarding-hero__actions">
          <button class="btn primary onboarding-cta" @click=${props.onNext}>Start setup</button>
          <button class="btn" @click=${props.onSkip}>Skip for now</button>
        </div>
      </div>

      <div class="onboarding-highlight-grid">
        ${highlights.map(
          (item, index) => html`
            <article class="onboarding-highlight-card" style=${`animation-delay:${index * 80}ms`}>
              <div class="onboarding-highlight-card__icon">${item.icon}</div>
              <h2>${item.title}</h2>
              <p>${item.body}</p>
            </article>
          `,
        )}
      </div>
    </section>
  `;
}
