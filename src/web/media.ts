import { loadWebMedia, type WebMediaResult } from "../media/media-loader.js";

export { loadWebMedia, type WebMediaResult };

export async function loadWebMediaRaw(url: string, options?: Parameters<typeof loadWebMedia>[1]) {
  return await loadWebMedia(url, options);
}

export function getDefaultLocalRoots(): string[] {
  return [];
}

export async function optimizeImageToJpeg(..._args: unknown[]) {
  throw new Error("Image optimization is not available in this build.");
}
