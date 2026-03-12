---
summary: "Messaging platforms OpenClaw can connect to"
read_when:
  - You want to choose a chat channel for OpenClaw
  - You need a quick overview of supported messaging platforms
title: "Chat Channels"
---

# Chat Channels

OpenClaw can talk to you on any chat app you already use. Each channel connects via the Gateway.
Text is supported everywhere; media and reactions vary by channel.

## Supported channels

- [Discord](/channels/discord) — Discord Bot API + Gateway; supports servers, channels, and DMs.
- [LINE](/channels/line) — LINE Messaging API bot (plugin, installed separately).
- [Telegram](/channels/telegram) — Bot API via grammY; supports groups.

## Notes

- Channels can run simultaneously; configure multiple and OpenClaw will route per chat.
- Fastest setup is usually **Telegram** (simple bot token).
- Group behavior varies by channel; see [Groups](/channels/groups).
- DM pairing and allowlists are enforced for safety; see [Security](/gateway/security).
- Troubleshooting: [Channel troubleshooting](/channels/troubleshooting).
- Model providers are documented separately; see [Model Providers](/providers/models).
