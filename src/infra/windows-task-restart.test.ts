import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { captureFullEnv } from "../test-utils/env.js";

const spawnMock = vi.hoisted(() => vi.fn());
const resolvePreferredLalaTmpDirMock = vi.hoisted(() => vi.fn(() => os.tmpdir()));

vi.mock("node:child_process", () => ({
  spawn: (...args: unknown[]) => spawnMock(...args),
}));
vi.mock("./tmp-lala-dir.js", () => ({
  resolvePreferredLalaTmpDir: () => resolvePreferredLalaTmpDirMock(),
}));

import { relaunchGatewayScheduledTask } from "./windows-task-restart.js";

const envSnapshot = captureFullEnv();
const createdScriptPaths = new Set<string>();
const createdTmpDirs = new Set<string>();

function decodeCmdPathArg(value: string): string {
  const trimmed = value.trim();
  const withoutQuotes =
    trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1) : trimmed;
  return withoutQuotes.replace(/\^!/g, "!").replace(/%%/g, "%");
}

afterEach(() => {
  envSnapshot.restore();
  spawnMock.mockReset();
  resolvePreferredLalaTmpDirMock.mockReset();
  resolvePreferredLalaTmpDirMock.mockReturnValue(os.tmpdir());
  for (const scriptPath of createdScriptPaths) {
    try {
      fs.unlinkSync(scriptPath);
    } catch {
      // Best-effort cleanup for temp helper scripts created in tests.
    }
  }
  createdScriptPaths.clear();
  for (const tmpDir of createdTmpDirs) {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup for test temp roots.
    }
  }
  createdTmpDirs.clear();
});

describe("relaunchGatewayScheduledTask", () => {
  it("writes a detached schtasks relaunch helper", () => {
    const unref = vi.fn();
    let seenCommandArg = "";
    spawnMock.mockImplementation((_file: string, args: string[]) => {
      seenCommandArg = args[3];
      createdScriptPaths.add(decodeCmdPathArg(args[3]));
      return { unref };
    });

    const result = relaunchGatewayScheduledTask({ LALA_PROFILE: "work" });

    expect(result).toMatchObject({
      ok: true,
      method: "schtasks",
      tried: expect.arrayContaining(['schtasks /Run /TN "Lala Gateway (work)"']),
    });
    expect(result.tried).toContain(`cmd.exe /d /s /c ${seenCommandArg}`);
    expect(spawnMock).toHaveBeenCalledWith(
      "cmd.exe",
      ["/d", "/s", "/c", expect.any(String)],
      expect.objectContaining({
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      }),
    );
    expect(unref).toHaveBeenCalledOnce();

    const scriptPath = [...createdScriptPaths][0];
    expect(scriptPath).toBeTruthy();
    const script = fs.readFileSync(scriptPath, "utf8");
    expect(script).toContain("timeout /t 1 /nobreak >nul");
    expect(script).toContain('schtasks /Run /TN "Lala Gateway (work)" >nul 2>&1');
    expect(script).toContain('del "%~f0" >nul 2>&1');
  });

  it("prefers LALA_WINDOWS_TASK_NAME then OPENCLAW_WINDOWS_TASK_NAME overrides", () => {
    spawnMock.mockImplementation((_file: string, args: string[]) => {
      createdScriptPaths.add(decodeCmdPathArg(args[3]));
      return { unref: vi.fn() };
    });

    relaunchGatewayScheduledTask({
      LALA_PROFILE: "work",
      LALA_WINDOWS_TASK_NAME: "Lala Gateway (lala-custom)",
    });

    const scriptPathLala = [...createdScriptPaths][0];
    const scriptLala = fs.readFileSync(scriptPathLala, "utf8");
    expect(scriptLala).toContain('schtasks /Run /TN "Lala Gateway (lala-custom)" >nul 2>&1');

    createdScriptPaths.clear();
    relaunchGatewayScheduledTask({
      OPENCLAW_PROFILE: "work",
      OPENCLAW_WINDOWS_TASK_NAME: "Lala Gateway (openclaw-custom)",
    });

    const scriptPathOpenClaw = [...createdScriptPaths][0];
    const scriptOpenClaw = fs.readFileSync(scriptPathOpenClaw, "utf8");
    expect(scriptOpenClaw).toContain('schtasks /Run /TN "Lala Gateway (openclaw-custom)" >nul 2>&1');
  });

  it("returns failed when the helper cannot be spawned", () => {
    spawnMock.mockImplementation(() => {
      throw new Error("spawn failed");
    });

    const result = relaunchGatewayScheduledTask({ LALA_PROFILE: "work" });

    expect(result.ok).toBe(false);
    expect(result.method).toBe("schtasks");
    expect(result.detail).toContain("spawn failed");
  });

  it("quotes the cmd /c script path when temp paths contain metacharacters", () => {
    const unref = vi.fn();
    const metacharTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lala&(restart)-"));
    createdTmpDirs.add(metacharTmpDir);
    resolvePreferredLalaTmpDirMock.mockReturnValue(metacharTmpDir);
    spawnMock.mockReturnValue({ unref });

    relaunchGatewayScheduledTask({ LALA_PROFILE: "work" });

    expect(spawnMock).toHaveBeenCalledWith(
      "cmd.exe",
      ["/d", "/s", "/c", expect.stringMatching(/^".*&.*"$/)],
      expect.any(Object),
    );
  });
});
