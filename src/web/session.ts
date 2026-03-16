export const WA_WEB_AUTH_DIR = ".lala/whatsapp";

export async function createWaSocket(..._args: unknown[]) {
  throw new Error("WhatsApp Web session is not available in this build.");
}

export function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function getStatusCode(..._args: unknown[]) {
  return undefined;
}

export async function logoutWeb(..._args: unknown[]) {
  throw new Error("WhatsApp Web session is not available in this build.");
}

export function logWebSelfId(..._args: unknown[]) {}

export function pickWebChannel(..._args: unknown[]) {
  return null;
}

export async function waitForWaConnection(..._args: unknown[]) {
  throw new Error("WhatsApp Web session is not available in this build.");
}

export function webAuthExists(..._args: unknown[]) {
  return false;
}
