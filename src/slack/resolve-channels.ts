export type SlackChannelAllowlistEntry = {
  resolved: boolean;
  id: string;
  input: string;
};

export async function resolveSlackChannelAllowlist(params: { token: string; entries: string[] }): Promise<SlackChannelAllowlistEntry[]> {
  return params.entries.map((entry) => {
    const trimmed = entry.trim();
    return {
      resolved: false,
      id: trimmed,
      input: trimmed,
    };
  });
}
