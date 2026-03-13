---
layout: default
title: "Getting Started"
---

# Getting Started

Goal: go from zero to a first working chat with minimal setup.

<div class="cta-section">
<div class="cta-content">
<h3>🚀 Fastest chat: Control UI</h3>
<p>Open the browser Control UI (no channel setup needed). Run <code>lala dashboard</code> and chat in the browser, or open <code>http://127.0.0.1:18789/</code> on the gateway host.</p>
<a href="/web/control-ui">🎮 Open Dashboard</a>
</div>
</div>

## 📋 Prereqs

- **Node 24 recommended** (Node 22 LTS, currently `22.16+`, still supported for compatibility)

<div class="feature-card">
<h3>💡 Check your Node version</h3>
<p>Run <code>node --version</code> if you are unsure.</p>
</div>

## 🎯 Quick Setup (CLI)

<div class="feature-grid">

<div class="feature-card">
<h3>📦 1. Install Lala</h3>
<pre><code>npm install -g lala@latest</code></pre>
<p>Installs the Lala CLI globally on your system.</p>
</div>

<div class="feature-card">
<h3>🔧 2. Onboard and install the service</h3>
<pre><code>lala onboard --install-daemon</code></pre>
<p>Sets up configuration and installs the system service.</p>
</div>

<div class="feature-card">
<h3>📱 3. Pair WhatsApp and start the Gateway</h3>
<pre><code>lala channels login
lala gateway --port 18789</code></pre>
<p>Connect your messaging apps and start the gateway.</p>
</div>

</div>

## 🎮 Alternative: Web Dashboard

<div class="cta-section">
<div class="cta-content">
<h3>🌐 No setup required!</h3>
<p>Just run <code>lala dashboard</code> and start chatting in your browser. Perfect for testing!</p>
<a href="/web/dashboard">Try Dashboard Now</a>
</div>
</div>

## 📚 Next Steps

<div class="feature-grid">

<div class="feature-card">
<h3>⚙️ Configuration</h3>
<p>Set up models, tools, and customize your Lala experience.</p>
<p><a href="/gateway/configuration">📖 Configure Lala</a></p>
</div>

<div class="feature-card">
<h3>📡 Channel Setup</h3>
<p>Connect your favorite messaging platforms.</p>
<p><a href="/channels">📖 Setup Channels</a></p>
</div>

<div class="feature-card">
<h3>🆘 Troubleshooting</h3>
<p>Having issues? Find solutions here.</p>
<p><a href="/help/troubleshooting">📖 Get Help</a></p>
</div>

</div>

## 🎯 Choose Your Path

| Method | Time | Setup | Best For |
|--------|------|-------|----------|
| **Dashboard** | 30s | None | Quick testing, no phone needed |
| **CLI + WhatsApp** | 5 min | Phone scan | Most users, full features |
| **CLI + Telegram** | 2 min | Bot token | Fastest setup, groups |
| **CLI + Discord** | 5 min | Bot app | Server communities |
