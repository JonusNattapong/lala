import type { WebClient } from "@slack/web-api";

export async function createSlackWebClient(token: string): Promise<WebClient> {
  const { WebClient } = await import("@slack/web-api");
  return new WebClient(token);
}
