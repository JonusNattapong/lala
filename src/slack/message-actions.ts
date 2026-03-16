import type { LalaConfig } from "../config/config.js";

export function listSlackMessageActions(_cfg: LalaConfig): string[] {
  return ["send", "react", "read", "edit", "delete"];
}

export function extractSlackToolSend(args: Record<string, unknown>) {
  const to = typeof args.to === "string" ? args.to : undefined;
  const message = typeof args.message === "string" ? args.message : undefined;
  return to && message ? { to, message } : null;
}
