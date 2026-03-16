import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs(["node", "lala", "gateway", "--dev", "--allow-unconfigured"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "lala", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "lala", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "lala", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "lala", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "lala", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "lala", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "lala", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "lala", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".lala-dev");
    expect(env.LALA_PROFILE).toBe("dev");
    expect(env.LALA_STATE_DIR).toBe(expectedStateDir);
    expect(env.LALA_CONFIG_PATH).toBe(path.join(expectedStateDir, "lala.json"));
    expect(env.LALA_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      LALA_STATE_DIR: "/custom",
      LALA_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.LALA_STATE_DIR).toBe("/custom");
    expect(env.LALA_GATEWAY_PORT).toBe("19099");
    expect(env.LALA_CONFIG_PATH).toBe(path.join("/custom", "lala.json"));
  });

  it("uses LALA_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      LALA_HOME: "/srv/lala-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/lala-home");
    expect(env.LALA_STATE_DIR).toBe(path.join(resolvedHome, ".lala-work"));
    expect(env.LALA_CONFIG_PATH).toBe(path.join(resolvedHome, ".lala-work", "lala.json"));
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "lala doctor --fix",
      env: {},
      expected: "lala doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "lala doctor --fix",
      env: { LALA_PROFILE: "default" },
      expected: "lala doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "lala doctor --fix",
      env: { LALA_PROFILE: "Default" },
      expected: "lala doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "lala doctor --fix",
      env: { LALA_PROFILE: "bad profile" },
      expected: "lala doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "lala --profile work doctor --fix",
      env: { LALA_PROFILE: "work" },
      expected: "lala --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "lala --dev doctor",
      env: { LALA_PROFILE: "dev" },
      expected: "lala --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("lala doctor --fix", { LALA_PROFILE: "work" })).toBe(
      "lala --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("lala doctor --fix", { LALA_PROFILE: "  jblala  " })).toBe(
      "lala --profile jblala doctor --fix",
    );
  });

  it("handles command with no args after lala", () => {
    expect(formatCliCommand("lala", { LALA_PROFILE: "test" })).toBe("lala --profile test");
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm lala doctor", { LALA_PROFILE: "work" })).toBe(
      "pnpm lala --profile work doctor",
    );
  });
});
