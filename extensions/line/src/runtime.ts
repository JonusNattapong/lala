import { createPluginRuntimeStore } from "lala/plugin-sdk/compat";
import type { PluginRuntime } from "lala/plugin-sdk/line";

const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } =
  createPluginRuntimeStore<PluginRuntime>("LINE runtime not initialized - plugin not registered");
export { getLineRuntime, setLineRuntime };
