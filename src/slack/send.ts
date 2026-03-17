function unsupported(): never {
  throw new Error("Slack messaging is not available in this build.");
}

export type SlackSendIdentity = {
  accountId?: string;
  token?: string;
  username?: string;
  iconUrl?: string;
  iconEmoji?: string;
};

export async function sendMessageSlack(..._args: unknown[]): Promise<{ channelId: string }> {
  return unsupported();
}
