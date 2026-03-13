---
layout: default
title: "Chat Channels"
summary: "Messaging platforms Lala can connect to"
---

# Chat Channels

Lala can talk to you on any chat app you already use. Each channel connects via the Gateway.
Text is supported everywhere; media and reactions vary by channel.

<div class="feature-grid">

<div class="feature-card">
<h3>🎮 Discord</h3>
<p>Discord Bot API + Gateway; supports servers, channels, and DMs.</p>
<p><a href="/channels/discord">📖 Setup Guide</a></p>
</div>

<div class="feature-card">
<h3>💬 LINE</h3>
<p>LINE Messaging API bot (plugin, installed separately).</p>
<p><a href="/channels/line">📖 Setup Guide</a></p>
</div>

<div class="feature-card">
<h3>✈️ Telegram</h3>
<p>Bot API via grammY; supports groups.</p>
<p><a href="/channels/telegram">📖 Setup Guide</a></p>
</div>

<div class="feature-card">
<h3>📱 WhatsApp</h3>
<p>WhatsApp Web integration; supports text, media, and voice.</p>
<p><a href="/channels/whatsapp">📖 Setup Guide</a></p>
</div>

<div class="feature-card">
<h3>🍎 iMessage</h3>
<p>Native macOS integration; supports text and media.</p>
<p><a href="/channels/imessage">📖 Setup Guide</a></p>
</div>

<div class="feature-card">
<h3>🔌 Signal</h3>
<p>Signal messaging integration; supports secure messaging.</p>
<p><a href="/channels/signal">📖 Setup Guide</a></p>
</div>

</div>

## 🚀 Quick Setup

<div class="cta-section">
<div class="cta-content">
<h3>🎯 Fastest setup?</h3>
<p>Start with <strong>Telegram</strong> - just need a simple bot token from @BotFather!</p>
<a href="/channels/telegram">Get Started with Telegram</a>
</div>
</div>

## 📋 Important Notes

- **🔄 Multiple Channels**: Channels can run simultaneously; configure multiple and Lala will route per chat.
- **🛡️ Security**: DM pairing and allowlists are enforced for safety; see [Security](/gateway/security).
- **👥 Groups**: Group behavior varies by channel; see [Groups](/channels/groups).
- **🔧 Troubleshooting**: [Channel troubleshooting](/channels/troubleshooting).
- **🤖 Model Providers**: Documented separately; see [Model Providers](/providers/models).

## 🎯 Channel Comparison

| Channel | Setup Time | Groups | Media | Voice | Platform |
|---------|-------------|--------|-------|-------|----------|
| Discord | 5 min | ✅ | ✅ | ✅ | All |
| Telegram | 2 min | ✅ | ✅ | ✅ | All |
| LINE | 10 min | ✅ | ✅ | ❌ | All |
| WhatsApp | 5 min | ✅ | ✅ | ✅ | All |
| iMessage | 1 min | ❌ | ✅ | ✅ | macOS |
| Signal | 10 min | ✅ | ✅ | ✅ | All |
