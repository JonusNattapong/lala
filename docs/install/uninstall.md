---
summary: "Uninstall Lala completely (CLI, service, state, workspace)"
read_when:
  - You want to remove Lala from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `lala` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
lala uninstall
```

Non-interactive (automation / npx):

```bash
lala uninstall --all --yes --non-interactive
npx -y lala uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
lala gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
lala gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${OPENCLAW_STATE_DIR:-$HOME/.lala}"
```

If you set `OPENCLAW_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.lala/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g lala
pnpm remove -g lala
bun remove -g lala
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/Lala.app
```

Notes:

- If you used profiles (`--profile` / `OPENCLAW_PROFILE`), repeat step 3 for each state dir (defaults are `~/.lala-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `lala` is missing.

### macOS (launchd)

Default label is `ai.lala.gateway` (or `ai.lala.<profile>`; legacy `com.lala.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.lala.gateway
rm -f ~/Library/LaunchAgents/ai.lala.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.lala.<profile>`. Remove any legacy `com.lala.*` plists if present.

### Linux (systemd user unit)

Default unit name is `lala-gateway.service` (or `lala-gateway-<profile>.service`):

```bash
systemctl --user disable --now lala-gateway.service
rm -f ~/.config/systemd/user/lala-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `Lala Gateway` (or `Lala Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "Lala Gateway"
Remove-Item -Force "$env:USERPROFILE\.lala\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.lala-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://lala.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g lala@latest`.
Remove it with `npm rm -g lala` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `lala ...` / `bun run lala ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
