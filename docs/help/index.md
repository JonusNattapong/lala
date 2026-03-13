---
layout: default
title: "Help"
summary: "Help hub: common fixes, install sanity, and where to look when something breaks"
---

# Help

If you want a quick “get unstuck” flow, start here:

<div class="feature-grid">

<div class="feature-card">
<h3>🔧 Troubleshooting</h3>
<p>Step-by-step fixes for common issues and error messages.</p>
<p><a href="/help/troubleshooting">📖 Start Troubleshooting</a></p>
</div>

<div class="feature-card">
<h3>💻 Install Sanity</h3>
<p>Node, npm, PATH, and environment setup issues.</p>
<p><a href="/install#nodejs--npm-path-sanity">📖 Check Install</a></p>
</div>

<div class="feature-card">
<h3>🌉 Gateway Issues</h3>
<p>Gateway startup, connection, and configuration problems.</p>
<p><a href="/gateway/troubleshooting">📖 Gateway Help</a></p>
</div>

<div class="feature-card">
<h3>📝 Logs</h3>
<p>Understanding logs and debugging information.</p>
<p><a href="/logging">📖 View Logs</a></p>
</div>

<div class="feature-card">
<h3>🔍 Gateway Logging</h3>
<p>Gateway-specific logging and monitoring.</p>
<p><a href="/gateway/logging">📖 Gateway Logs</a></p>
</div>

<div class="feature-card">
<h3>❓ FAQ</h3>
<p>Frequently asked questions and quick answers.</p>
<p><a href="/help/faq">📖 View FAQ</a></p>
</div>

</div>

## 🚨 Quick Fixes

<div class="cta-section">
<div class="cta-content">
<h3>🎯 Most Common Issues</h3>
<p><strong>Gateway won't start?</strong> Check <code>lala doctor</code> first!</p>
<p><strong>Can't connect?</strong> Verify your API keys and network.</p>
<p><strong>Messages not working?</strong> Check channel allowlists.</p>
<a href="/help/troubleshooting">🔧 Start Troubleshooting</a>
</div>
</div>

## 🎯 Choose Your Help Path

| Issue Type | First Stop | Common Cause |
|------------|-------------|---------------|
| **Gateway won't start** | `lala doctor` | Node version, config syntax |
| **Can't send messages** | Channel troubleshooting | API keys, allowlists |
| **Slow responses** | Provider status | Model limits, network |
| **Install issues** | Install sanity | PATH, Node version |
| **Weird behavior** | Logs review | Config conflicts, versions |

## 🆘 Emergency Help

<div class="feature-card">
<h3>🚨 Something broken?</h3>
<p>1. Run <code>lala doctor</code> for quick diagnostics</p>
<p>2. Check logs with <code>lala logs --follow</code></p>
<p>3. Try restarting: <code>lala restart</code></p>
<p>4. Still stuck? <a href="/help/troubleshooting">Full troubleshooting guide</a></p>
</div>
- **Repairs:** [Doctor](/gateway/doctor)

If you’re looking for conceptual questions (not “something broke”):

- [FAQ (concepts)](/help/faq)
