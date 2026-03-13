---
layout: default
title: "Getting Started"
---

# Getting Started

Goal: go from zero to a first working chat with minimal setup.

## Prereqs

- Node 24 recommended (Node 22 LTS, currently `22.16+`, still supported for compatibility)

## Quick setup (CLI)

1. **Install Lala**
   ```bash
   npm install -g lala@latest
   ```

2. **Onboard and install the service**
   ```bash
   lala onboard --install-daemon
   ```

3. **Pair WhatsApp and start the Gateway**
   ```bash
   lala channels login
   lala gateway --port 18789
   ```

## Next steps

- [Configuration](/gateway/configuration)
- [Channel setup](/channels)
- [Troubleshooting](/help/troubleshooting)
