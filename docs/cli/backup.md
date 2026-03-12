---
summary: "CLI reference for `lala backup` (create local backup archives)"
read_when:
  - You want a first-class backup archive for local Lala state
  - You want to preview which paths would be included before reset or uninstall
title: "backup"
---

# `lala backup`

Create a local backup archive for Lala state, config, credentials, sessions, and optionally workspaces.

```bash
lala backup create
lala backup create --output ~/Backups
lala backup create --dry-run --json
lala backup create --verify
lala backup create --no-include-workspace
lala backup create --only-config
lala backup verify ./2026-03-09T00-00-00.000Z-lala-backup.tar.gz
```

## Notes

- The archive includes a `manifest.json` file with the resolved source paths and archive layout.
- Default output is a timestamped `.tar.gz` archive in the current working directory.
- If the current working directory is inside a backed-up source tree, Lala falls back to your home directory for the default archive location.
- Existing archive files are never overwritten.
- Output paths inside the source state/workspace trees are rejected to avoid self-inclusion.
- `lala backup verify <archive>` validates that the archive contains exactly one root manifest, rejects traversal-style archive paths, and checks that every manifest-declared payload exists in the tarball.
- `lala backup create --verify` runs that validation immediately after writing the archive.
- `lala backup create --only-config` backs up just the active JSON config file.

## What gets backed up

`lala backup create` plans backup sources from your local Lala install:

- The state directory returned by Lala's local state resolver, usually `~/.lala`
- The active config file path
- The OAuth / credentials directory
- Workspace directories discovered from the current config, unless you pass `--no-include-workspace`

If you use `--only-config`, Lala skips state, credentials, and workspace discovery and archives only the active config file path.

Lala canonicalizes paths before building the archive. If config, credentials, or a workspace already live inside the state directory, they are not duplicated as separate top-level backup sources. Missing paths are skipped.

The archive payload stores file contents from those source trees, and the embedded `manifest.json` records the resolved absolute source paths plus the archive layout used for each asset.

## Invalid config behavior

`lala backup` intentionally bypasses the normal config preflight so it can still help during recovery. Because workspace discovery depends on a valid config, `lala backup create` now fails fast when the config file exists but is invalid and workspace backup is still enabled.

If you still want a partial backup in that situation, rerun:

```bash
lala backup create --no-include-workspace
```

That keeps state, config, and credentials in scope while skipping workspace discovery entirely.

If you only need a copy of the config file itself, `--only-config` also works when the config is malformed because it does not rely on parsing the config for workspace discovery.

## Size and performance

Lala does not enforce a built-in maximum backup size or per-file size limit.

Practical limits come from the local machine and destination filesystem:

- Available space for the temporary archive write plus the final archive
- Time to walk large workspace trees and compress them into a `.tar.gz`
- Time to rescan the archive if you use `lala backup create --verify` or run `lala backup verify`
- Filesystem behavior at the destination path. Lala prefers a no-overwrite hard-link publish step and falls back to exclusive copy when hard links are unsupported

Large workspaces are usually the main driver of archive size. If you want a smaller or faster backup, use `--no-include-workspace`.

For the smallest archive, use `--only-config`.
