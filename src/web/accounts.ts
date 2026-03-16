import path from "node:path";
import { createAccountListHelpers } from "../channels/plugins/account-helpers.js";
import type { LalaConfig } from "../config/config.js";
import type { WhatsAppAccountConfig } from "../config/types.whatsapp.js";
import { resolveAccountEntry } from "../routing/account-lookup.js";
import { normalizeAccountId } from "../routing/session-key.js";

export type ResolvedWhatsAppAccount = {
  accountId: string;
  enabled: boolean;
  allowFrom?: string[];
  config: WhatsAppAccountConfig;
};

const { listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("whatsapp", {
  normalizeAccountId,
});

export const listWhatsAppAccountIds = listAccountIds;
export const resolveDefaultWhatsAppAccountId = resolveDefaultAccountId;

export function resolveWhatsAppAccount(params: {
  cfg: LalaConfig;
  accountId?: string | null;
}): ResolvedWhatsAppAccount {
  const accountId = normalizeAccountId(params.accountId);
  const { accounts: _accounts, defaultAccount: _defaultAccount, ...base } =
    (params.cfg.channels?.whatsapp ?? {}) as WhatsAppAccountConfig & {
      accounts?: unknown;
      defaultAccount?: unknown;
    };
  const account = resolveAccountEntry(params.cfg.channels?.whatsapp?.accounts, accountId) ?? {};
  const config: WhatsAppAccountConfig = { ...base, ...account };
  return {
    accountId,
    enabled: config.enabled !== false,
    allowFrom: config.allowFrom,
    config,
  };
}

export function resolveWhatsAppAuthDir(params: { cfg: LalaConfig; accountId?: string | null }) {
  const account = resolveWhatsAppAccount(params);
  const authDir = account.config.authDir?.trim() || path.join(".lala", "whatsapp", account.accountId);
  return { authDir };
}

export function hasAnyWhatsAppAuth(cfg: LalaConfig): boolean {
  return listWhatsAppAccountIds(cfg).some((accountId) => {
    const account = resolveWhatsAppAccount({ cfg, accountId });
    return Boolean(account.config.authDir?.trim());
  });
}
