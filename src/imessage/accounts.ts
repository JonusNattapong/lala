import { createAccountListHelpers } from "../channels/plugins/account-helpers.js";
import type { LalaConfig } from "../config/config.js";
import { normalizeAccountId } from "../routing/session-key.js";

export type ResolvedIMessageAccount = {
  accountId: string;
  enabled: boolean;
  config: {
    allowFrom?: Array<string | number>;
    defaultTo?: string;
  };
};

const { listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("imessage", {
  normalizeAccountId,
});

export const listIMessageAccountIds = listAccountIds;
export const resolveDefaultIMessageAccountId = resolveDefaultAccountId;

export function resolveIMessageAccount(params: {
  cfg: LalaConfig;
  accountId?: string | null;
}): ResolvedIMessageAccount {
  const accountId = normalizeAccountId(params.accountId);
  const channel = (params.cfg.channels?.imessage ?? {}) as {
    allowFrom?: Array<string | number>;
    defaultTo?: string;
    enabled?: boolean;
  };
  return {
    accountId,
    enabled: channel.enabled !== false,
    config: {
      allowFrom: channel.allowFrom,
      defaultTo: channel.defaultTo,
    },
  };
}
