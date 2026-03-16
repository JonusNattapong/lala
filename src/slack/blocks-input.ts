export function parseSlackBlocksInput(value: unknown): Record<string, unknown>[] | undefined {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : undefined;
}
