export type SignalTextStyleRange = {
  offset: number;
  length: number;
  style: string;
};

export type MarkdownToSignalTextChunksOptions = {
  tableMode?: "off" | "bullets" | "code" | "full" | "omit" | "plain";
};

export function markdownToSignalTextChunks(
  text: string,
  _limit?: number,
  _options?: MarkdownToSignalTextChunksOptions,
): Array<{
  text: string;
  styles?: SignalTextStyleRange[];
}> {
  return [{ text }];
}
