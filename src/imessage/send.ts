export async function sendMessageIMessage(..._args: unknown[]): Promise<{ messageId: string }> {
  throw new Error("iMessage is not available in this build.");
}
