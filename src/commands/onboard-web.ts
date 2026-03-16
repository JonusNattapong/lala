import process from "node:process";
import { readConfigFileSnapshot, resolveGatewayPort } from "../config/config.js";
import type { LalaConfig } from "../config/types.js";
import { callGateway } from "../gateway/call.js";
import { readGatewayTokenEnv } from "../gateway/credentials.js";
import { resolveConfiguredSecretInputWithFallback } from "../gateway/resolve-configured-secret-input-string.js";
import type { RuntimeEnv } from "../runtime.js";
import { defaultRuntime } from "../runtime.js";
import {
  detectBrowserOpenSupport,
  formatControlUiSshHint,
  openUrl,
  resolveControlUiLinks,
} from "./onboard-helpers.js";

type OnboardWebOptions = {
  port?: number;
  noOpen?: boolean;
  mode?: "local" | "remote";
  workspace?: string;
};

async function resolveGatewayToken(
  cfg: LalaConfig,
  env: Record<string, string | undefined> = process.env,
): Promise<string> {
  const resolved = await resolveConfiguredSecretInputWithFallback({
    config: cfg,
    env,
    value: cfg.gateway?.auth?.token,
    path: "gateway.auth.token",
    readFallback: () => readGatewayTokenEnv(env),
  });
  return resolved.value ?? "";
}

export async function onboardWebCommand(
  runtime: RuntimeEnv = defaultRuntime,
  options: OnboardWebOptions = {},
) {
  const snapshot = await readConfigFileSnapshot();
  const cfg = snapshot.valid ? snapshot.config : {};
  const port = options.port ?? resolveGatewayPort(cfg);
  const bind = cfg.gateway?.bind ?? "loopback";
  const basePath = cfg.gateway?.controlUi?.basePath;
  const customBindHost = cfg.gateway?.customBindHost;

  const links = resolveControlUiLinks({
    port,
    bind: bind === "lan" ? "loopback" : bind,
    customBindHost,
    basePath,
  });

  const token = await resolveGatewayToken(cfg, process.env);
  const startResult = await callGateway<{ sessionId: string }>({
    method: "wizard.start",
    params: {
      ...(options.mode ? { mode: options.mode } : {}),
      ...(options.workspace?.trim() ? { workspace: options.workspace.trim() } : {}),
    },
    token: token || undefined,
    timeoutMs: 15_000,
    requiredMethods: ["wizard.start"],
  });
  
  // Construct the onboarding URL.
  const onboardingUrl = new URL(links.httpUrl);
  onboardingUrl.searchParams.set("onboarding", "wizard");
  onboardingUrl.searchParams.set("wizardSessionId", startResult.sessionId);

  // Include token if available to auto-auth the session
  if (token) {
    onboardingUrl.hash = `token=${encodeURIComponent(token)}`;
  }

  const finalUrl = onboardingUrl.toString();

  runtime.log(`Starting web-based onboarding...`);
  runtime.log(`URL: ${finalUrl}`);

  let opened = false;
  if (!options.noOpen) {
    const browserSupport = await detectBrowserOpenSupport();
    if (browserSupport.ok) {
      opened = await openUrl(finalUrl);
    }
  }

  if (opened) {
    runtime.log("Opened in your browser. Follow the instructions on the screen to set up Lala.");
  } else {
    const hint = formatControlUiSshHint({
      port,
      basePath,
      token: token || undefined,
    });
     runtime.log(options.noOpen ? "Browser launch disabled (--no-open)." : "Could not open browser automatically.");
     runtime.log(hint);
     runtime.log(`\nManual onboarding link: ${finalUrl}`);
   }
}
