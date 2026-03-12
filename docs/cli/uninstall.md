---
summary: "CLI reference for `lala uninstall` (remove gateway service + local data)"
read_when:
  - You want to remove the gateway service and/or local state
  - You want a dry-run first
title: "uninstall"
---

# `lala uninstall`

Uninstall the gateway service + local data (CLI remains).

```bash
lala backup create
lala uninstall
lala uninstall --all --yes
lala uninstall --dry-run
```

Run `lala backup create` first if you want a restorable snapshot before removing state or workspaces.
