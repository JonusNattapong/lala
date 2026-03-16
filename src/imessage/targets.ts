export function normalizeIMessageHandle(value: string): string {
  return value.trim().toLowerCase();
}

export function parseIMessageTarget(value: string) {
  const normalized = normalizeIMessageHandle(value);
  return normalized ? { normalized } : null;
}
