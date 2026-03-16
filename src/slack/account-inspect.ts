import type { LalaConfig } from "../config/config.js";
import type { SlackAccountConfig } from "../config/types.slack.js";
import { hasConfiguredSecretInput, normalizeSecretInputString } from "../config/types.secrets.js";
import { normalizeAccountId } from "../routing/session-key.js";
import { resolveSlackAccount, resolveSlackAccountConfig } from "./accounts.js";

export type SlackCredentialStatus = "available" | "configured_unavailable" | "missing";

export type InspectedSlackAccount = ReturnType<typeof inspectSlackAccount>;

function getStatus(value: unknown): SlackCredentialStatus {
  if (normalizeSecretInputString(value)) {
    return "available";
  }
  return hasConfiguredSecretInput(value) ? "configured_unavailable" : "missing";
}

export function inspectSlackAccount(params: {
  cfg: LalaConfig;
  accountId?: string | null;
}) {
  const accountId = normalizeAccountId(params.accountId);
  const resolved = resolveSlackAccount({ cfg: params.cfg, accountId });
  const accountConfig = resolveSlackAccountConfig(params.cfg, accountId) ?? {};
  const config: SlackAccountConfig = resolved.config;
  const botTokenStatus = getStatus(accountConfig.botToken ?? params.cfg.channels?.slack?.botToken);
  const appTokenStatus = getStatus(accountConfig.appToken ?? params.cfg.channels?.slack?.appToken);
  const userTokenStatus = getStatus(accountConfig.userToken ?? params.cfg.channels?.slack?.userToken);
  return {
    accountId,
    enabled: resolved.enabled,
    name: config.name?.trim() || undefined,
    botToken: resolved.botToken ?? "",
    appToken: resolved.appToken ?? "",
    userToken: resolved.userToken ?? "",
    botTokenSource: resolved.botToken ? "config" : "none",
    appTokenSource: resolved.appToken ? "config" : "none",
    userTokenSource: resolved.userToken ? "config" : "none",
    botTokenStatus,
    appTokenStatus,
    userTokenStatus,
    configured: botTokenStatus !== "missing" || appTokenStatus !== "missing",
    config,
    channels: config.channels,
    dm: config.dm,
  };
}
