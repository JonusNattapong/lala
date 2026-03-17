export function extractMediaPlaceholder(..._args: unknown[]) {
  return null;
}

export function extractText(..._args: unknown[]) {
  return "";
}

export type WebInboundMessage = {
  id: string;
  from: string;
  body: string;
  hasMedia: boolean;
  timestamp: number;
};

export type WebListenerCloseReason = "logout" | "error" | "manual";

export async function monitorWebInbox(..._args: unknown[]) {
  throw new Error("WhatsApp Web inbound is not available in this build.");
}
