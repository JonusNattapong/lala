export type ParsedChatTarget = {
  raw: string;
  normalized: string;
  service?: string;
};

function normalize(raw: string): ParsedChatTarget {
  const normalized = raw.trim();
  return { raw, normalized };
}

export function parseChatAllowTargetPrefixes(values: string[]): ParsedChatTarget[] {
  return values.map((value) => normalize(value));
}

export function parseChatTargetPrefixesOrThrow(values: string[]): ParsedChatTarget[] {
  return parseChatAllowTargetPrefixes(values);
}

export function resolveServicePrefixedAllowTarget(value: string): string {
  return normalize(value).normalized;
}

export function resolveServicePrefixedTarget(value: string): string {
  return normalize(value).normalized;
}
