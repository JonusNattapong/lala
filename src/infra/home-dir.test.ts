import path from "node:path";
import { describe, expect, it } from "vitest";
import { expandHomePrefix, resolveEffectiveHomeDir, resolveRequiredHomeDir } from "./home-dir.js";

describe("resolveEffectiveHomeDir", () => {
  it("prefers LALA_HOME then OPENCLAW_HOME over HOME and USERPROFILE", () => {
    const envWithLala = {
      LALA_HOME: "/srv/lala-home-new",
      OPENCLAW_HOME: "/srv/lala-home-old",
      HOME: "/home/other",
      USERPROFILE: "C:/Users/other",
    } as NodeJS.ProcessEnv;

    expect(resolveEffectiveHomeDir(envWithLala, () => "/fallback")).toBe(
      path.resolve("/srv/lala-home-new"),
    );

    const envWithOpenClaw = {
      OPENCLAW_HOME: "/srv/lala-home-old",
      HOME: "/home/other",
    } as NodeJS.ProcessEnv;

    expect(resolveEffectiveHomeDir(envWithOpenClaw, () => "/fallback")).toBe(
      path.resolve("/srv/lala-home-old"),
    );
  });

  it("falls back to HOME then USERPROFILE then homedir", () => {
    expect(resolveEffectiveHomeDir({ HOME: "/home/alice" } as NodeJS.ProcessEnv)).toBe(
      path.resolve("/home/alice"),
    );
    expect(resolveEffectiveHomeDir({ USERPROFILE: "C:/Users/alice" } as NodeJS.ProcessEnv)).toBe(
      path.resolve("C:/Users/alice"),
    );
    expect(resolveEffectiveHomeDir({} as NodeJS.ProcessEnv, () => "/fallback")).toBe(
      path.resolve("/fallback"),
    );
  });

  it("expands LALA_HOME or OPENCLAW_HOME when set to ~", () => {
    const envLala = {
      LALA_HOME: "~/svc",
      HOME: "/home/alice",
    } as NodeJS.ProcessEnv;

    expect(resolveEffectiveHomeDir(envLala)).toBe(path.resolve("/home/alice/svc"));

    const envOpenClaw = {
      OPENCLAW_HOME: "~/svc",
      HOME: "/home/alice",
    } as NodeJS.ProcessEnv;

    expect(resolveEffectiveHomeDir(envOpenClaw)).toBe(path.resolve("/home/alice/svc"));
  });
});

describe("resolveRequiredHomeDir", () => {
  it("returns cwd when no home source is available", () => {
    expect(
      resolveRequiredHomeDir({} as NodeJS.ProcessEnv, () => {
        throw new Error("no home");
      }),
    ).toBe(process.cwd());
  });

  it("returns a fully resolved path for LALA_HOME or OPENCLAW_HOME", () => {
    expect(
      resolveRequiredHomeDir({ LALA_HOME: "/custom/home" } as NodeJS.ProcessEnv, () => "/fallback"),
    ).toBe(path.resolve("/custom/home"));
    expect(
      resolveRequiredHomeDir(
        { OPENCLAW_HOME: "/custom/home" } as NodeJS.ProcessEnv,
        () => "/fallback",
      ),
    ).toBe(path.resolve("/custom/home"));
  });

  it("returns cwd when LALA_HOME or OPENCLAW_HOME is tilde-only and no fallback home exists", () => {
    expect(
      resolveRequiredHomeDir({ LALA_HOME: "~" } as NodeJS.ProcessEnv, () => {
        throw new Error("no home");
      }),
    ).toBe(process.cwd());
    expect(
      resolveRequiredHomeDir({ OPENCLAW_HOME: "~" } as NodeJS.ProcessEnv, () => {
        throw new Error("no home");
      }),
    ).toBe(process.cwd());
  });
});

describe("expandHomePrefix", () => {
  it("expands tilde using effective home (LALA_HOME)", () => {
    const value = expandHomePrefix("~/x", {
      env: { LALA_HOME: "/srv/lala-home" } as NodeJS.ProcessEnv,
    });
    expect(value).toBe(`${path.resolve("/srv/lala-home")}/x`);
  });

  it("keeps non-tilde values unchanged", () => {
    expect(expandHomePrefix("/tmp/x")).toBe("/tmp/x");
  });
});
