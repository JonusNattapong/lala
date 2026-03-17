export async function resolveSlackUserAllowlist(params: { token?: string; entries: string[] }) {
  if (!params.token) {
    return params.entries.map((entry) => ({
      input: entry.trim(),
      resolved: true,
    }));
  }
  return params.entries.map((entry) => ({
    input: entry.trim(),
    resolved: true,
  }));
}
