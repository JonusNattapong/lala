export type IMessageProbe = {
  ok: boolean;
  reason?: string;
};

export async function probeIMessage(..._args: unknown[]): Promise<IMessageProbe> {
  return { ok: false, reason: "imessage unavailable" };
}
