export function looksLikeUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());
}

export function resolveSignalPeerId(value: string): string {
  return value.trim().replace(/^signal:/i, "");
}

export function resolveSignalRecipient(value: string): string {
  return resolveSignalPeerId(value);
}

export function resolveSignalSender(value: string): string {
  return resolveSignalPeerId(value);
}
