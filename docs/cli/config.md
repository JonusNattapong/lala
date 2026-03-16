---
summary: "CLI reference for `lala config` (get/set/unset/file/validate)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `lala config`

Config helpers: get/set/unset/validate values by path and print the active
config file. Run without a subcommand to open
the configure wizard (same as `lala configure`).

## Examples

```bash
lala config file
lala config get browser.executablePath
lala config set browser.executablePath "/usr/bin/google-chrome"
lala config set agents.defaults.heartbeat.every "2h"
lala config set agents.list[0].tools.exec.node "node-id-or-name"
lala config unset tools.web.search.apiKey
lala config validate
lala config validate --json
```

## Paths

Paths use dot or bracket notation:

```bash
lala config get agents.defaults.workspace
lala config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
lala config get agents.list
lala config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
lala config set agents.defaults.heartbeat.every "0m"
lala config set gateway.port 19001 --strict-json
lala config set channels.whatsapp.groups '["*"]' --strict-json
```

## Subcommands

- `config file`: Print the active config file path (resolved from `LALA_CONFIG_PATH` or default location).

Restart the gateway after edits.

## Validate

Validate the current config against the active schema without starting the
gateway.

```bash
lala config validate
lala config validate --json
```
