export type SignalTextStyleRange = {
  offset: number;
  length: number;
  style: string;
};

export function markdownToSignalTextChunks(text: string): Array<{
  text: string;
  styles?: SignalTextStyleRange[];
}> {
  return [{ text }];
}
