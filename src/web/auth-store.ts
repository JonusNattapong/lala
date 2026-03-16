export function logWebSelfId(..._args: unknown[]) {}
export function readWebSelfId(..._args: unknown[]) {
  return null;
}
export function getWebAuthAgeMs(..._args: unknown[]) {
  return null;
}
export async function logoutWeb(..._args: unknown[]) {
  throw new Error("WhatsApp Web is not available in this build.");
}
export function webAuthExists(..._args: unknown[]) {
  return false;
}
