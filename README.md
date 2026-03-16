<p align="center">
  <img src="assets/lala-bg.png" width="450" alt="lala banner" />
</p>

<p align="center">
  <h1 align="center">🦋 lala</h1>
  <p align="center">
    <strong>The Premium Personal AI Assistant Gateway</strong><br />
    <em>Deep Ocean Aesthetics · Aurora Performance · Personal Sovereignty</em>
  </p>
</p>

<p align="center">
  <a href="https://github.com/JonusNattapong/lala/actions"><img src="https://img.shields.io/github/actions/workflow/status/JonusNattapong/lala/ci.yml?branch=main&style=for-the-badge&color=2dd4bf" alt="CI Status"></a>
  <a href="https://github.com/JonusNattapong/lala/releases"><img src="https://img.shields.io/github/v/release/JonusNattapong/lala?include_prereleases&style=for-the-badge&color=14b8a6" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-0ea5e9.svg?style=for-the-badge" alt="MIT License"></a>
</p>

---

`lala` is a high-performance, personal AI gateway designed for those who value **sovereignty, speed, and stunning aesthetics**. Evolved from its spiritual predecessor OpenClaw, `lala` introduces the **Aurora Design System**—a premium Deep Ocean interface that makes interacting with your AI feel like a state-of-the-art experience.

[Docs](https://docs.lala.ai) · [Getting Started](https://docs.lala.ai/getting-started) · [Channels](/docs/channels) · [Skills](/docs/skills)

---

## Core Philosophy

- **Personal Sovereignty**: Your data, your keys, your machine. No middlemen.
- **Aurora Aesthetics**: A premium UI featuring glassmorphism and deep ocean tones.
- **Messaging Gateway**: Seamlessly bridge your AI to Telegram, Discord, Signal, and more.
- **CLI-Native**: Optimized for power users who live in the terminal.
- **Unified Ecosystem**: Native companion apps for macOS, iOS, Android, and Web.

## Recommended: Onboarding Wizard

The fastest way to get started is the onboarding wizard. It will help you set up your workspace, channels, and initial skills.

```bash
# Install globally
npm install -g lala

# Run the wizard
lala onboard --install-daemon
```

## Quick Start (CLI)

Once set up, you can interact with `lala` directly from your terminal.

```bash
# Run the gateway manually (if not running as a daemon)
lala gateway --port 18789 --verbose

# Send a direct message through a channel
lala message send --message "hello"

# Ask the agent to do something
lala agent --message "summarize my inbox"
```

## Supported Channels

`lala` focuses on the most popular messaging platforms for a reliable experience:

- **Telegram**: Set `TELEGRAM_BOT_TOKEN` or `channels.telegram.botToken`.
- **Discord**: Set `DISCORD_BOT_TOKEN` or `channels.discord.token`.
- **LINE**: Set `LINE_CHANNEL_ACCESS_TOKEN` and `LINE_CHANNEL_SECRET`.

## Development

If you'd like to build from source or contribute:

```bash
git clone https://github.com/JonusNattapong/lala.git
cd lala
pnpm install
pnpm build
pnpm lala onboard
```

## Notes

- `lala` shares technical ancestry with OpenClaw.
- We prioritize a small, stable channel surface and easy local setup.
- For full documentation, visit [docs.lala.ai](https://docs.lala.ai).

## License

MIT
