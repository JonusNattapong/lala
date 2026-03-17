function unsupported(): never {
  throw new Error("Signal messaging is not available in this build.");
}

export async function sendMessageSignal(..._args: unknown[]): Promise<{ messageId: string }> {
  return unsupported();
}
