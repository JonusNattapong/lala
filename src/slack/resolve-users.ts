export async function resolveSlackUserAllowlist(params: { entries: string[] }) {
  return params.entries.map((entry) => entry.trim()).filter(Boolean);
}
