import { createPluginRuntimeStore } from "lala/plugin-sdk/compat";
import type { PluginRuntime } from "lala/plugin-sdk/telegram";

const { setRuntime: setTelegramRuntime, getRuntime: getTelegramRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Telegram runtime not initialized");
export { getTelegramRuntime, setTelegramRuntime };
