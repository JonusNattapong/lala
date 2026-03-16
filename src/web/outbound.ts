function unsupported() {
  throw new Error("WhatsApp Web outbound is not available in this build.");
}

export async function sendMessageWhatsApp(..._args: unknown[]) { unsupported(); }
export async function sendPollWhatsApp(..._args: unknown[]) { unsupported(); }
export async function sendReactionWhatsApp(..._args: unknown[]) { unsupported(); }
