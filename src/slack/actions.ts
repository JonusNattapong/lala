function unsupported() {
  throw new Error("Slack actions are not available in this build.");
}

export async function sendSlackMessage(..._args: unknown[]) { unsupported(); }
export async function reactSlackMessage(..._args: unknown[]) { unsupported(); }
export async function removeSlackReaction(..._args: unknown[]) { unsupported(); }
export async function removeOwnSlackReactions(..._args: unknown[]) { unsupported(); }
export async function listSlackReactions(..._args: unknown[]) { unsupported(); }
export async function pinSlackMessage(..._args: unknown[]) { unsupported(); }
export async function unpinSlackMessage(..._args: unknown[]) { unsupported(); }
export async function listSlackPins(..._args: unknown[]) { unsupported(); }
export async function readSlackMessages(..._args: unknown[]) { unsupported(); }
export async function editSlackMessage(..._args: unknown[]) { unsupported(); }
export async function deleteSlackMessage(..._args: unknown[]) { unsupported(); }
export async function downloadSlackFile(..._args: unknown[]) { unsupported(); }
export async function getSlackMemberInfo(..._args: unknown[]) { unsupported(); }
export async function listSlackEmojis(..._args: unknown[]) { unsupported(); }
