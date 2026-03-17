import type { LalaConfig } from "../config/config.js";
import {
  resolveReactionLevel,
  type ResolvedReactionLevel as BaseResolvedReactionLevel,
} from "../utils/reaction-level.js";
import { resolveSignalAccount } from "./accounts.js";

export type ResolvedReactionLevel = BaseResolvedReactionLevel;

export function resolveSignalReactionLevel(params: {
  cfg: LalaConfig;
  accountId?: string | null;
}): ResolvedReactionLevel {
  const account = resolveSignalAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return resolveReactionLevel({
    value: account.config.reactionLevel,
    defaultLevel: "minimal",
    invalidFallback: "ack",
  });
}
