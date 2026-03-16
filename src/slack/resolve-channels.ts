export async function resolveSlackChannelAllowlist(params: { entries: string[] }) {
  return params.entries.map((entry) => entry.trim()).filter(Boolean);
}
