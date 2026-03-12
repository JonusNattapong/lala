---
summary: "CLI reference for `lala reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `lala reset`

Reset local config/state (keeps the CLI installed).

```bash
lala backup create
lala reset
lala reset --dry-run
lala reset --scope config+creds+sessions --yes --non-interactive
```

Run `lala backup create` first if you want a restorable snapshot before removing local state.
