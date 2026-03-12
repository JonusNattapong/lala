// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export type { LalaConfig } from "../config/config.js";
export { resolvePreferredLalaTmpDir } from "../infra/tmp-lala-dir.js";
export type {
  AnyAgentTool,
  LalaPluginApi,
  LalaPluginConfigSchema,
  PluginLogger,
} from "../plugins/types.js";
