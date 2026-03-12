---
summary: "CLI reference for `lala voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `lala voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
lala voicecall status --call-id <id>
lala voicecall call --to "+15555550123" --message "Hello" --mode notify
lala voicecall continue --call-id <id> --message "Any questions?"
lala voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
lala voicecall expose --mode serve
lala voicecall expose --mode funnel
lala voicecall expose --mode off
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
