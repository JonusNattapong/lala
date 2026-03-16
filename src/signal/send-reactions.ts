function unsupported() {
  throw new Error("Signal reactions are not available in this build.");
}

export async function sendReactionSignal(..._args: unknown[]) {
  unsupported();
}

export async function removeReactionSignal(..._args: unknown[]) {
  unsupported();
}
