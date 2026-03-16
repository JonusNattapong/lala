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
  onFinish: () => void;
  onOpenChannelSettings: () => void;
}) {
  return html`
    <section class="onboarding-step">
      <div class="onboarding-copy-block">
        <div class="onboarding-copy-block__eyebrow">The hands</div>
        <h1>ChannelChoice now reflects live channel state.</h1>
        <p>
          The CLI onboarding adapters configure channel-specific auth here. In the web flow we show
          the real status snapshot so you can see what is already configured and jump to the full
          channel setup screen when needed.
        </p>
      </div>

      <div class="onboarding-chip-group">
        <span class="onboarding-chip-group__label">CLI domain:</span>
        <span class="onboarding-chip">ChannelChoice</span>
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
          <p>Open the channels screen for the real setup controls used by each channel plugin.</p>
        </div>
        <button class="btn" @click=${props.onOpenChannelSettings}>Open channel settings</button>
      </div>

      <div class="onboarding-actions">
        <button class="btn" @click=${props.onBack}>Back</button>
        <button class="btn primary" @click=${props.onFinish}>Finish</button>
      </div>
    </section>
  `;
}
