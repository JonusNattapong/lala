import type { LalaConfig } from "../config/config.js";
import { resolveSignalAccount } from "./accounts.js";

export function resolveSignalReactionLevel(params: {
  cfg: LalaConfig;
  accountId?: string | null;
}) {
  const level = resolveSignalAccount(params).config.reactionLevel ?? "minimal";
  return {
    level,
    agentReactionsEnabled: level === "minimal" || level === "extensive",
  };
}
