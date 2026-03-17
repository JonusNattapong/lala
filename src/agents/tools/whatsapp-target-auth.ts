import type { LalaConfig } from "../../config/config.js";
import { resolveWhatsAppAccount } from "../../web/accounts.js";
import { resolveWhatsAppOutboundTarget } from "../../whatsapp/resolve-outbound-target.js";
import { ToolAuthorizationError } from "./common.js";

export function resolveAuthorizedWhatsAppOutboundTarget(params: {
  cfg: LalaConfig;
  chatJid: string;
  accountId?: string;
  actionLabel: string;
}): { to: string; accountId: string } {
  const account = resolveWhatsAppAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const resolution = resolveWhatsAppOutboundTarget(params.chatJid);
  if (resolution !== params.chatJid) {
    throw new ToolAuthorizationError(
      `WhatsApp ${params.actionLabel} blocked: chatJid "${params.chatJid}" is not in the configured allowFrom list for account "${account.accountId}".`,
    );
  }
  return { to: params.chatJid, accountId: account.accountId };
}
