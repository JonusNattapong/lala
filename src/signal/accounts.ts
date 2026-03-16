import { createAccountListHelpers } from "../channels/plugins/account-helpers.js";
import type { LalaConfig } from "../config/config.js";
import type { SignalAccountConfig } from "../config/types.signal.js";
import { resolveAccountEntry } from "../routing/account-lookup.js";
import { normalizeAccountId } from "../routing/session-key.js";

export type ResolvedSignalAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
  config: SignalAccountConfig;
};

const { listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("signal", {
  normalizeAccountId,
});

export const listSignalAccountIds = listAccountIds;
export const resolveDefaultSignalAccountId = resolveDefaultAccountId;

export function resolveSignalAccountConfig(
  cfg: LalaConfig,
  accountId: string,
): SignalAccountConfig | undefined {
  return resolveAccountEntry(cfg.channels?.signal?.accounts, accountId);
}

export function resolveSignalAccount(params: {
  cfg: LalaConfig;
  accountId?: string | null;
}): ResolvedSignalAccount {
  const accountId = normalizeAccountId(params.accountId);
  const { accounts: _accounts, defaultAccount: _defaultAccount, ...base } =
    (params.cfg.channels?.signal ?? {}) as SignalAccountConfig & {
      accounts?: unknown;
      defaultAccount?: unknown;
    };
  const account = resolveSignalAccountConfig(params.cfg, accountId) ?? {};
  const config: SignalAccountConfig = { ...base, ...account };
  const enabled = config.enabled !== false;
  const configured = Boolean(config.account?.trim() || config.httpUrl?.trim());
  return { accountId, enabled, configured, config };
}

export function listEnabledSignalAccounts(cfg: LalaConfig): ResolvedSignalAccount[] {
  return listSignalAccountIds(cfg)
    .map((accountId) => resolveSignalAccount({ cfg, accountId }))
    .filter((account) => account.enabled);
}
