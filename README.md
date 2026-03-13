<p align="center">
  <img src="assets/lala-bg.png" width="400" alt="lala banner" />
</p>

# 🦋 lala — Personal AI Assistant

<p align="center">
  <strong>RELAX! RELAX!</strong>
</p>

<p align="center">
  <a href="https://github.com/JonusNattapong/lala/actions"><img src="https://img.shields.io/github/actions/workflow/status/JonusNattapong/lala/ci.yml?branch=main&style=for-the-badge" alt="CI Status"></a>
  <a href="https://github.com/JonusNattapong/lala/releases"><img src="https://img.shields.io/github/v/release/JonusNattapong/lala?include_prereleases&style=for-the-badge" alt="Release"></a>
  <a href="https://docs.lala.ai"><img src="https://img.shields.io/badge/Docs-Mintlify-blue?style=for-the-badge" alt="Docs"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License"></a>
</p>

If you want a personal, single-user assistant that feels local, fast, and always-on, this is it. `lala` is a personal AI assistant gateway inspired by OpenClaw, focused on a simpler setup and a streamlined experience.

[Docs](https://docs.lala.ai) · [Getting Started](https://docs.lala.ai/getting-started) · [Channels](/docs/channels) · [Skills](/docs/skills)

---

## What lala is

- **Local Assistant**: Runs on your own machine. Your data, your keys.
- **Messaging Gateway**: Bridge your AI to Telegram, Discord, and LINE.
- **CLI-First**: Optimized for terminal power users.
- **Cross-Platform**: Optional companion apps for macOS, iOS, Android, and Web.

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
