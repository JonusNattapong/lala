import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolvePluginProviders } from "./providers.js";

const loadLalaPluginsMock = vi.fn();

vi.mock("./loader.js", () => ({
  loadLalaPlugins: (...args: unknown[]) => loadLalaPluginsMock(...args),
}));

describe("resolvePluginProviders", () => {
  beforeEach(() => {
    loadLalaPluginsMock.mockReset();
    loadLalaPluginsMock.mockReturnValue({
      providers: [{ provider: { id: "demo-provider" } }],
    });
  });

  it("forwards an explicit env to plugin loading", () => {
    const env = { LALA_HOME: "/srv/lala-home" } as NodeJS.ProcessEnv;

    const providers = resolvePluginProviders({
      workspaceDir: "/workspace/explicit",
      env,
    });

    expect(providers).toEqual([{ id: "demo-provider" }]);
    expect(loadLalaPluginsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceDir: "/workspace/explicit",
        env,
      }),
    );
  });
});
