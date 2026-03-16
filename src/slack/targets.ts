export type SlackTarget = {
  kind: "user" | "channel";
  id: string;
  normalized: string;
};

export function parseSlackTarget(
  raw: string,
  options?: { defaultKind?: "user" | "channel" },
): SlackTarget | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  if (/^user:/i.test(trimmed) || /^@/.test(trimmed)) {
    const id = trimmed.replace(/^user:/i, "").replace(/^@/, "").trim();
    return id ? { kind: "user", id, normalized: `user:${id}` } : null;
  }
  const id = trimmed.replace(/^channel:/i, "").replace(/^#/, "").trim();
  const kind = /^channel:/i.test(trimmed) || /^#/.test(trimmed)
    ? "channel"
    : (options?.defaultKind ?? "channel");
  return id ? { kind, id, normalized: `${kind}:${id}` } : null;
}

export function resolveSlackChannelId(raw: string): string {
  return parseSlackTarget(raw, { defaultKind: "channel" })?.id ?? raw.trim();
}
