import { html } from "lit";
import type { OnboardingChannelState } from "./onboarding-flow.ts";

function formatStatus(channel: OnboardingChannelState): string {
  if (channel.connected) {
    return "Connected";
  }
  if (channel.running) {
    return "Running";
  }
  if (channel.configured) {
    return "Configured";
  }
  return "Not set up";
}

export function renderOnboardingChannelsStep(props: {
  channels: OnboardingChannelState[];
  onBack: () => void;
  onNext: () => void;
  onOpenChannelSettings: () => void;
}) {
  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">The hands</div>
        <h1>Choose how people will reach Lala.</h1>
        <p>
          Start in the built-in web chat if you just want to try things. When you are ready, connect
          messaging channels like Telegram, Slack, or Discord from the full channel settings screen.
        </p>
      </div>

      <div class="onboarding-chip-group">
        <span class="onboarding-chip-group__label">Recommended:</span>
        <span class="onboarding-chip">Start with web chat</span>
      </div>

      <div class="onboarding-choice-grid">
        ${props.channels.map(
          (channel) => html`
            <article class="onboarding-choice-card onboarding-choice-card--channel ${channel.connected
              ? "is-selected"
              : ""}">
              <div class="onboarding-channel-mark">${channel.glyph}</div>
              <div class="onboarding-choice-card__content">
                <div class="onboarding-choice-card__title-row">
                  <h2>${channel.label}</h2>
                  <span class="onboarding-choice-card__badge">${formatStatus(channel)}</span>
                </div>
                <p>${channel.detail}</p>
              </div>
            </article>
          `,
        )}
      </div>

      <div class="onboarding-models-panel">
        <div>
          <strong>Need QR codes, tokens, or adapter-specific forms?</strong>
          <p>Open channel settings for the detailed setup screens used by each channel.</p>
        </div>
        <button class="btn" @click=${props.onOpenChannelSettings}>Open channel settings</button>
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn primary" @click=${props.onNext}>Continue</button>
      </div>
    </section>
  `;
}
