export type SlackProbe = {
  ok: boolean;
  configured?: boolean;
  reason?: string;
};

export async function probeSlack(..._args: unknown[]): Promise<SlackProbe> {
  return { ok: false, reason: "slack unavailable" };
}
