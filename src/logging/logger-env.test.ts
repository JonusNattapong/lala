import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getResolvedConsoleSettings,
  getResolvedLoggerSettings,
  resetLogger,
  setLoggerOverride,
} from "../logging.js";
import { loggingState } from "./state.js";

const testLogPath = path.join(os.tmpdir(), "lala-test-env-log-level.log");
const defaultMaxFileBytes = 500 * 1024 * 1024;

describe("LALA_LOG_LEVEL", () => {
  let originalLala: string | undefined;
  let originalOpenClaw: string | undefined;

  beforeEach(() => {
    originalLala = process.env.LALA_LOG_LEVEL;
    originalOpenClaw = process.env.LALA_LOG_LEVEL;
    delete process.env.LALA_LOG_LEVEL;
    delete process.env.LALA_LOG_LEVEL;
    loggingState.invalidEnvLogLevelValue = null;
    resetLogger();
    setLoggerOverride(null);
  });

  afterEach(() => {
    if (originalLala === undefined) {
      delete process.env.LALA_LOG_LEVEL;
    } else {
      process.env.LALA_LOG_LEVEL = originalLala;
    }
    if (originalOpenClaw === undefined) {
      delete process.env.LALA_LOG_LEVEL;
    } else {
      process.env.LALA_LOG_LEVEL = originalOpenClaw;
    }
    loggingState.invalidEnvLogLevelValue = null;
    resetLogger();
    setLoggerOverride(null);
    vi.restoreAllMocks();
  });

  it("applies a valid env override to both file and console levels", () => {
    setLoggerOverride({
      level: "error",
      consoleLevel: "warn",
      consoleStyle: "json",
      file: testLogPath,
    });
    process.env.LALA_LOG_LEVEL = "debug";

    expect(getResolvedLoggerSettings()).toEqual({
      level: "debug",
      file: testLogPath,
      maxFileBytes: defaultMaxFileBytes,
    });
    expect(getResolvedConsoleSettings()).toEqual({
      level: "debug",
      style: "json",
    });
  });

  it("prioritizes LALA_LOG_LEVEL over LALA_LOG_LEVEL", () => {
    process.env.LALA_LOG_LEVEL = "debug";
    process.env.LALA_LOG_LEVEL = "error";

    expect(getResolvedLoggerSettings().level).toBe("debug");
    expect(getResolvedConsoleSettings().level).toBe("debug");
  });

  it("warns once and ignores invalid env values", () => {
    setLoggerOverride({
      level: "error",
      consoleLevel: "warn",
      consoleStyle: "compact",
      file: testLogPath,
    });
    process.env.LALA_LOG_LEVEL = "nope";
    const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(
      () => true as unknown as ReturnType<typeof process.stderr.write>, // preserve stream contract in test spy
    );

    expect(getResolvedLoggerSettings().level).toBe("error");
    expect(getResolvedLoggerSettings().maxFileBytes).toBe(defaultMaxFileBytes);
    expect(getResolvedConsoleSettings().level).toBe("warn");
    expect(getResolvedLoggerSettings().level).toBe("error");

    const warnings = stderrSpy.mock.calls
      .map(([firstArg]) => String(firstArg))
      .filter((line) => line.includes("LALA_LOG_LEVEL"));
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Ignoring invalid LALA_LOG_LEVEL="nope"');
  });
});
