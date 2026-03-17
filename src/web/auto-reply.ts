export const DEFAULT_WEB_MEDIA_BYTES = 0;
export const HEARTBEAT_PROMPT = "";
export const HEARTBEAT_TOKEN = "";

export type WebChannelStatus = {
  active: boolean;
  listenerCount: number;
  lastMessageAt: number | null;
};

export type WebMonitorTuning = {
  heartbeatIntervalMs?: number;
  maxEventBatchSize?: number;
};

export async function monitorWebChannel(..._args: unknown[]) {
  throw new Error("WhatsApp Web monitoring is not available in this build.");
}

export function resolveHeartbeatRecipients(..._args: unknown[]) {
  return [];
}

export async function runWebHeartbeatOnce(..._args: unknown[]) {
  return { ok: false };
}
