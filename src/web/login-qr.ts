export async function startWebLoginWithQr(..._args: unknown[]): Promise<{ message: string; qrDataUrl?: string }> {
  throw new Error("WhatsApp Web QR login is not available in this build.");
}

export async function waitForWebLogin(..._args: unknown[]): Promise<{ message: string; connected: boolean }> {
  throw new Error("WhatsApp Web QR login is not available in this build.");
}
