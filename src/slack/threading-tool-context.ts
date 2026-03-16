import type { ChannelThreadingToolContext } from "../channels/plugins/types.js";

export function buildSlackThreadingToolContext(params: {
  context: {
    NativeChannelId?: string;
    To?: string;
    ReplyToId?: string;
  };
  hasRepliedRef?: { value: boolean };
}): ChannelThreadingToolContext {
  const currentChannelId = (params.context.NativeChannelId ?? params.context.To?.trim()) || undefined;
  return {
    currentChannelId,
    currentThreadTs: params.context.ReplyToId,
    hasRepliedRef: params.hasRepliedRef,
  };
}
