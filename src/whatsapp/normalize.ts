export function normalizeWhatsAppTarget(value: string): string | null {
  const normalized = value.trim();
  return normalized || null;
}

export function normalizeWhatsAppMessagingTarget(value: string): string | undefined {
  return normalizeWhatsAppTarget(value) ?? undefined;
}

export function isWhatsAppGroupJid(value: string): boolean {
  return value.includes("@g.us");
}
