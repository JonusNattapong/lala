import { createSubsystemLogger } from "../logging/subsystem.js";
import { parseBooleanValue } from "../utils/boolean.js";

const log = createSubsystemLogger("env");
const loggedEnv = new Set<string>();

type AcceptedEnvOption = {
  key: string;
  description: string;
  value?: string;
  redact?: boolean;
};

function formatEnvValue(value: string, redact?: boolean): string {
  if (redact) {
    return "<redacted>";
  }
  const singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= 160) {
    return singleLine;
  }
  return `${singleLine.slice(0, 160)}…`;
}

export function logAcceptedEnvOption(option: AcceptedEnvOption): void {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return;
  }
  if (loggedEnv.has(option.key)) {
    return;
  }
  const rawValue = option.value ?? process.env[option.key];
  if (!rawValue || !rawValue.trim()) {
    return;
  }
  loggedEnv.add(option.key);
  log.info(`env: ${option.key}=${formatEnvValue(rawValue, option.redact)} (${option.description})`);
}

export function normalizeZaiEnv(): void {
  if (!process.env.ZAI_API_KEY?.trim() && process.env.Z_AI_API_KEY?.trim()) {
    process.env.ZAI_API_KEY = process.env.Z_AI_API_KEY;
  }
}

export function normalizeLalaEnv(): void {
  const env = process.env;
  const mapPair = (key: string, legacyKey: string) => {
    if (env[key] === undefined && env[legacyKey] !== undefined) {
      env[key] = env[legacyKey];
    }
  };

  const pairs: Array<[string, string]> = [
    ["LALA_GATEWAY_TOKEN", "LALABOT_GATEWAY_TOKEN"],
    ["LALA_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_TOKEN"],
    ["LALA_PROFILE", "LALABOT_PROFILE"],
    ["LALA_PROFILE", "OPENCLAW_PROFILE"],
    ["LALA_STATE_DIR", "LALABOT_STATE_DIR"],
    ["LALA_STATE_DIR", "OPENCLAW_STATE_DIR"],
    ["LALA_STATE_DIR", "CLAWDBOT_STATE_DIR"],
    ["LALA_CONFIG_PATH", "LALABOT_CONFIG_PATH"],
    ["LALA_CONFIG_PATH", "OPENCLAW_CONFIG_PATH"],
    ["LALA_GATEWAY_PORT", "LALABOT_GATEWAY_PORT"],
    ["LALA_GATEWAY_PORT", "OPENCLAW_GATEWAY_PORT"],
    ["LALA_SKIP_CHANNELS", "LALABOT_SKIP_CHANNELS"],
    ["LALA_SKIP_CHANNELS", "OPENCLAW_SKIP_CHANNELS"],
    ["LALA_SKIP_CHANNELS", "OPENCLAW_SKIP_PROVIDERS"],
    ["LALA_AUTH_STORE_READONLY", "LALABOT_AUTH_STORE_READONLY"],
    ["LALA_AUTH_STORE_READONLY", "OPENCLAW_AUTH_STORE_READONLY"],
    ["LALA_NO_RESPAWN", "LALABOT_NO_RESPAWN"],
    ["LALA_NO_RESPAWN", "OPENCLAW_NO_RESPAWN"],
    ["LALA_NODE_OPTIONS_READY", "LALABOT_NODE_OPTIONS_READY"],
    ["LALA_NODE_OPTIONS_READY", "OPENCLAW_NODE_OPTIONS_READY"],
    ["LALA_TEST_FAST", "LALABOT_TEST_FAST"],
    ["LALA_TEST_FAST", "OPENCLAW_TEST_FAST"],
    ["LALA_HOME", "LALABOT_HOME"],
    ["LALA_HOME", "OPENCLAW_HOME"],
  ];

  for (const [key, legacyKey] of pairs) {
    mapPair(key, legacyKey);
  }
}

export function isTruthyEnvValue(value?: string): boolean {
  return parseBooleanValue(value) === true;
}

export function normalizeEnv(): void {
  normalizeZaiEnv();
  normalizeLalaEnv();
}
