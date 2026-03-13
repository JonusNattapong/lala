---
layout: default
title: "Lala - Multi-channel AI Gateway"
summary: "Lala is a multi-channel gateway for AI agents that runs on any OS."
---

# Lala

<p align="center">
    <img
        src="../assets/lala-bg.png"
        alt="Lala"
        width="500"
    />
</p>

> _"EXFOLIATE! EXFOLIATE!"_ — A space lobster, probably

<p align="center">
  <strong>Any OS gateway for AI agents across WhatsApp, Telegram, Discord, iMessage, and more.</strong><br />
  Send a message, get an agent response from your pocket. Plugins add Mattermost and more.
</p>

<div class="feature-grid">
<div class="feature-card">
<h3><a href="/start/getting-started">Get Started</a></h3>
<p>Install Lala and bring up the Gateway in minutes.</p>
</div>
<div class="feature-card">
<h3><a href="/start/wizard">Run the Wizard</a></h3>
<p>Guided setup with <code>lala onboard</code> and pairing flows.</p>
</div>
<div class="feature-card">
<h3><a href="/web/control-ui">Open the Control UI</a></h3>
<p>Launch the browser dashboard for chat, config, and sessions.</p>
</div>
</div>

## What is Lala?

Lala is a **self-hosted gateway** that connects your favorite chat apps — WhatsApp, Telegram, Discord, iMessage, and more — to AI coding agents like Pi. You run a single Gateway process on your own machine (or a server), and it becomes the bridge between your messaging apps and an always-available AI assistant.

**Who is it for?** Developers and power users who want a personal AI assistant they can message from anywhere — without giving up control of their data or relying on a hosted service.

**What makes it different?**

- **Self-hosted**: runs on your hardware, your rules
- **Multi-channel**: one Gateway serves WhatsApp, Telegram, Discord, and more simultaneously
- **Agent-native**: built for coding agents with tool use, sessions, memory, and multi-agent routing
- **Open source**: MIT licensed, community-driven

**What do you need?** Node 24 (recommended), or Node 22 LTS (`22.16+`) for compatibility, an API key from your chosen provider, and 5 minutes. For best quality and security, use the strongest latest-generation model available.

## How it works

1. Chat apps and plugins send messages into the Gateway.
2. The Gateway routes requests to agents, tools, CLI flows, and the web UI.
3. Sessions, routing, and channel connections stay centralized in one place.

The Gateway is the single source of truth for sessions, routing, and channel connections.

## Key capabilities

<div class="feature-grid">

<div class="feature-card">
<h3>🚀 Multi-channel gateway</h3>
<p>WhatsApp, Telegram, Discord, and iMessage with a single Gateway process.</p>
</div>

<div class="feature-card">
<h3>🔌 Plugin channels</h3>
<p>Add Mattermost and more with extension packages.</p>
</div>

<div class="feature-card">
<h3>🎯 Multi-agent routing</h3>
<p>Isolated sessions per agent, workspace, or sender.</p>
</div>

<div class="feature-card">
<h3>📎 Media support</h3>
<p>Send and receive images, audio, and documents.</p>
</div>

<div class="feature-card">
<h3>🖥️ Web Control UI</h3>
<p>Browser dashboard for chat, config, sessions, and nodes.</p>
</div>

<div class="feature-card">
<h3>📱 Mobile nodes</h3>
<p>Pair iOS and Android nodes for Canvas, camera, and voice-enabled workflows.</p>
</div>

</div>

<div class="cta-section">
<div class="cta-content">
<h3>🚀 Ready to get started?</h3>
<p>Check out the <a href="https://github.com/JonusNattapong/lala">GitHub repository</a> to install Lala and join our community!</p>
</div>
</div>

## Quick start

1. Install Lala

```bash
npm install -g lala@latest
```

2. Onboard and install the service

```bash
lala onboard --install-daemon
```

3. Pair WhatsApp and start the Gateway

```bash
lala channels login
lala gateway --port 18789
```

Need the full install and dev setup? See [Quick start](/start/quickstart).

## Dashboard

Open the browser Control UI after the Gateway starts.

- Local default: [http://127.0.0.1:18789/](http://127.0.0.1:18789/)
- Remote access: [Web surfaces](/web) and [Tailscale](/gateway/tailscale)

<p align="center">
  <img src="/whatsapp-lala.jpg" alt="Lala" width="420" />
</p>

## Configuration (optional)

Config lives at `~/.lala/lala.json`.

- If you **do nothing**, Lala uses the bundled Pi binary in RPC mode with per-sender sessions.
- If you want to lock it down, start with `channels.whatsapp.allowFrom` and (for groups) mention rules.

Example:

```json5
{
  channels: {
    whatsapp: {
      allowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },
  },
  messages: { groupChat: { mentionPatterns: ["@lala"] } },
}
```

## Start here

<div class="feature-grid">

<div class="feature-card">
<h3>📚 <a href="/docs">Documentation Hub</a></h3>
<p>All docs and guides, organized by use case.</p>
</div>

<div class="feature-card">
<h3>⚙️ <a href="/gateway/configuration">Configuration</a></h3>
<p>Core Gateway settings, tokens, and provider config.</p>
</div>

<div class="feature-card">
<h3>🌐 <a href="/gateway/remote">Remote Access</a></h3>
<p>SSH and tailnet access patterns.</p>
</div>

<div class="feature-card">
<h3>📡 <a href="/channels">Channels</a></h3>
<p>Channel-specific setup for WhatsApp, Telegram, Discord, and more.</p>
</div>

<div class="feature-card">
<h3>📱 <a href="/nodes">Nodes</a></h3>
<p>iOS and Android nodes with pairing, Canvas, camera, and device actions.</p>
</div>

<div class="feature-card">
<h3>🆘 <a href="/help">Help</a></h3>
<p>Common fixes and troubleshooting entry point.</p>
</div>

</div>

## Learn more

<div class="feature-grid">

<div class="feature-card">
<h3>📋 <a href="/concepts/features">Full Feature List</a></h3>
<p>Complete channel, routing, and media capabilities.</p>
</div>

<div class="feature-card">
<h3>🎯 <a href="/concepts/multi-agent">Multi-agent Routing</a></h3>
<p>Workspace isolation and per-agent sessions.</p>
</div>

<div class="feature-card">
<h3>🛡️ <a href="/gateway/security">Security</a></h3>
<p>Tokens, allowlists, and safety controls.</p>
</div>

<div class="feature-card">
<h3>🔧 <a href="/gateway/troubleshooting">Troubleshooting</a></h3>
<p>Gateway diagnostics and common errors.</p>
</div>

<div class="feature-card">
<h3>ℹ️ <a href="/reference/credits">About and Credits</a></h3>
<p>Project origins, contributors, and license.</p>
</div>

</div>
