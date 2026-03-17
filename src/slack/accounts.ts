import { createAccountListHelpers } from "../channels/plugins/account-helpers.js";
import type { LalaConfig } from "../config/config.js";
import type { ReplyToMode } from "../config/types.base.js";
import type { SlackAccountConfig } from "../config/types.slack.js";
import { resolveAccountEntry } from "../routing/account-lookup.js";
import { normalizeAccountId } from "../routing/session-key.js";

export type ResolvedSlackAccount = {
  accountId: string;
  enabled: boolean;
  botToken?: string;
  appToken?: string;
  userToken?: string;
  actions?: SlackAccountConfig["actions"];
  channels?: SlackAccountConfig["channels"];
  dm?: SlackAccountConfig["dm"];
  groupPolicy?: "allow" | "deny" | "pairing";
  config: SlackAccountConfig;
};

const { listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("slack", {
  normalizeAccountId,
});

export const listSlackAccountIds = listAccountIds;
export const resolveDefaultSlackAccountId = resolveDefaultAccountId;

export function resolveSlackAccountConfig(
  cfg: LalaConfig,
  accountId: string,
): SlackAccountConfig | undefined {
  return resolveAccountEntry(cfg.channels?.slack?.accounts, accountId);
}

export function resolveSlackAccount(params: {
  cfg: LalaConfig;
  accountId?: string | null;
}): ResolvedSlackAccount {
  const accountId = normalizeAccountId(params.accountId);
  const { accounts: _accounts, defaultAccount: _defaultAccount, ...base } =
    (params.cfg.channels?.slack ?? {}) as SlackAccountConfig & {
      accounts?: unknown;
      defaultAccount?: unknown;
    };
  const account = resolveSlackAccountConfig(params.cfg, accountId) ?? {};
  const config: SlackAccountConfig = { ...base, ...account };
  return {
    accountId,
    enabled: config.enabled !== false,
    botToken: config.botToken?.trim() || undefined,
    appToken: config.appToken?.trim() || undefined,
    userToken: config.userToken?.trim() || undefined,
    actions: config.actions,
    channels: config.channels,
    dm: config.dm,
    config,
  };
}

export function resolveSlackReplyToMode(
  account: { config: SlackAccountConfig },
  chatType?: string,
): ReplyToMode {
  if (chatType && account.config.replyToModeByChatType?.[chatType as "direct" | "group" | "channel"]) {
    return account.config.replyToModeByChatType[chatType as "direct" | "group" | "channel"] as ReplyToMode;
  }
  return account.config.replyToMode ?? "off";
}
