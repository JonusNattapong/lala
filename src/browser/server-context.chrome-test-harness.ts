import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/lala" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchLalaChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveLalaUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopLalaChrome: vi.fn(async () => {}),
}));
