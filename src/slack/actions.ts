function unsupported(): never {
  throw new Error("Slack actions are not available in this build.");
}

export async function sendSlackMessage(..._args: unknown[]): Promise<{ channelId: string }> { return unsupported(); }
export async function reactSlackMessage(..._args: unknown[]): Promise<void> { return unsupported(); }
export async function removeSlackReaction(..._args: unknown[]): Promise<void> { return unsupported(); }
export async function removeOwnSlackReactions(..._args: unknown[]): Promise<void> { return unsupported(); }
export async function listSlackReactions(..._args: unknown[]): Promise<{ reactions: Array<{ name: string; users: string[] }> }> { return unsupported(); }
export async function pinSlackMessage(..._args: unknown[]): Promise<void> { return unsupported(); }
export async function unpinSlackMessage(..._args: unknown[]): Promise<void> { return unsupported(); }
export async function listSlackPins(..._args: unknown[]): Promise<{ messages: Array<{ channelId: string; ts: string; message?: Record<string, unknown> }> }> { return unsupported(); }
export async function readSlackMessages(..._args: unknown[]): Promise<{ messages: Array<{ text: string; user: string; ts: string }>; hasMore: boolean }> { return unsupported(); }
export async function editSlackMessage(..._args: unknown[]): Promise<void> { return unsupported(); }
export async function deleteSlackMessage(..._args: unknown[]): Promise<void> { return unsupported(); }
export async function downloadSlackFile(..._args: unknown[]): Promise<{ path: string; placeholder?: string }> { return unsupported(); }
export async function getSlackMemberInfo(..._args: unknown[]): Promise<{ profile: { displayName: string; image_72: string } }> { return unsupported(); }
export async function listSlackEmojis(..._args: unknown[]): Promise<{ emoji: Record<string, string> }> { return unsupported(); }
