function unsupported() {
  throw new Error("Slack messaging is not available in this build.");
}

export type SlackSendIdentity = { accountId?: string; token?: string };

export async function sendMessageSlack(..._args: unknown[]) {
  unsupported();
}
