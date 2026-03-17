import { createSubsystemLogger } from "../logging/subsystem.js";
import type { OutboundMediaLoadOptions } from "../media/load-options.js";
import { detectMime } from "../media/mime.js";

const mediaLog = createSubsystemLogger("media").child("loader");

export type WebMediaResult = {
  buffer: Buffer;
  contentType: string;
  fileName?: string;
  kind?: "image" | "video" | "audio" | "document";
};

export async function loadWebMedia(
  url: string,
  options?: OutboundMediaLoadOptions,
): Promise<WebMediaResult> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const headerMime = response.headers.get("content-type");
    const detectedMime = await detectMime({ buffer, headerMime });
    const contentType = detectedMime ?? "application/octet-stream";

    // Extract filename from URL or content-disposition if available
    let fileName: string | undefined;
    const urlFilename = new URL(url).pathname.split("/").pop();
    if (urlFilename) {
      fileName = urlFilename;
    }

    const contentDisposition = response.headers.get("content-disposition");
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch?.[1]) {
        fileName = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    mediaLog.debug("Loaded media", { url, contentType, fileName, size: buffer.length });

    return {
      buffer,
      contentType,
      fileName,
    };
  } catch (error) {
    mediaLog.error("Failed to load media", { url, error: String(error) });
    throw error;
  }
}
