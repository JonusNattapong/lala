export function normalizeAllowListLower(values: Iterable<string>): string[] {
  return Array.from(values, (value) => value.trim().toLowerCase()).filter(Boolean);
}
