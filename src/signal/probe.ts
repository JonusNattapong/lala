export type SignalProbe = {
  ok: boolean;
  configured?: boolean;
  reason?: string;
};

export async function probeSignal(..._args: unknown[]): Promise<SignalProbe> {
  return { ok: false, reason: "signal unavailable" };
}
