export function normalizeIMessageHandle(value: string): string {
  return value.trim().toLowerCase();
}

export type IMessageParsedTarget =
  | { kind: "handle"; to: string }
  | { kind: "chat_id"; chatId: string }
  | { kind: "chat_guid"; chatGuid: string }
  | { kind: "chat_identifier"; chatIdentifier: string };

export function parseIMessageTarget(value: string): IMessageParsedTarget | null {
  const normalized = normalizeIMessageHandle(value);
  if (!normalized) {
    return null;
  }
  if (normalized.startsWith("chat_id:")) {
    return { kind: "chat_id", chatId: normalized.slice("chat_id:".length) };
  }
  if (normalized.startsWith("chat_guid:")) {
    return { kind: "chat_guid", chatGuid: normalized.slice("chat_guid:".length) };
  }
  if (normalized.startsWith("chat_identifier:")) {
    return { kind: "chat_identifier", chatIdentifier: normalized.slice("chat_identifier:".length) };
  }
  return { kind: "handle", to: normalized };
}
