import { createPluginRuntimeStore } from "lala/plugin-sdk/compat";
import type { PluginRuntime } from "lala/plugin-sdk/discord";

const { setRuntime: setDiscordRuntime, getRuntime: getDiscordRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Discord runtime not initialized");
export { getDiscordRuntime, setDiscordRuntime };
