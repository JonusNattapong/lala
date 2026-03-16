import type { OutboundSendDeps } from "../infra/outbound/deliver.js";
import { createOutboundSendDepsFromCliSource } from "./outbound-send-mapping.js";

export type CliDeps = {
  sendMessageWhatsApp: OutboundSendDeps["sendWhatsApp"];
  sendMessageTelegram: OutboundSendDeps["sendTelegram"];
  sendMessageDiscord: OutboundSendDeps["sendDiscord"];
  sendMessageSlack: OutboundSendDeps["sendSlack"];
  sendMessageSignal: OutboundSendDeps["sendSignal"];
  sendMessageIMessage: OutboundSendDeps["sendIMessage"];
};

let whatsappSenderRuntimePromise: Promise<typeof import("./deps-send-whatsapp.runtime.js")> | null =
  null;
let telegramSenderRuntimePromise: Promise<typeof import("./deps-send-telegram.runtime.js")> | null =
  null;
let discordSenderRuntimePromise: Promise<typeof import("./deps-send-discord.runtime.js")> | null =
  null;
let slackSenderRuntimePromise: Promise<typeof import("./deps-send-slack.runtime.js")> | null = null;
let signalSenderRuntimePromise: Promise<typeof import("./deps-send-signal.runtime.js")> | null =
  null;
let imessageSenderRuntimePromise: Promise<typeof import("./deps-send-imessage.runtime.js")> | null =
  null;

function loadWhatsAppSenderRuntime() {
  whatsappSenderRuntimePromise ??= import("./deps-send-whatsapp.runtime.js");
  return whatsappSenderRuntimePromise;
}

function loadTelegramSenderRuntime() {
  telegramSenderRuntimePromise ??= import("./deps-send-telegram.runtime.js");
  return telegramSenderRuntimePromise;
}

function loadDiscordSenderRuntime() {
  discordSenderRuntimePromise ??= import("./deps-send-discord.runtime.js");
  return discordSenderRuntimePromise;
}

function loadSlackSenderRuntime() {
  slackSenderRuntimePromise ??= import("./deps-send-slack.runtime.js");
  return slackSenderRuntimePromise;
}

function loadSignalSenderRuntime() {
  signalSenderRuntimePromise ??= import("./deps-send-signal.runtime.js");
  return signalSenderRuntimePromise;
}

function loadIMessageSenderRuntime() {
  imessageSenderRuntimePromise ??= import("./deps-send-imessage.runtime.js");
  return imessageSenderRuntimePromise;
}

export function createDefaultDeps(): CliDeps {
  return {
    sendMessageWhatsApp: async (...args) => {
      const { sendMessageWhatsApp } = await loadWhatsAppSenderRuntime();
      return await sendMessageWhatsApp(...args);
    },
    sendMessageTelegram: async (...args) => {
      const { sendMessageTelegram } = await loadTelegramSenderRuntime();
      return await sendMessageTelegram(...args);
    },
    sendMessageDiscord: async (...args) => {
      const { sendMessageDiscord } = await loadDiscordSenderRuntime();
      return await sendMessageDiscord(...args);
    },
    sendMessageSlack: async (...args) => {
      const { sendMessageSlack } = await loadSlackSenderRuntime();
      return await sendMessageSlack(...args);
    },
    sendMessageSignal: async (...args) => {
      const { sendMessageSignal } = await loadSignalSenderRuntime();
      return await sendMessageSignal(...args);
    },
    sendMessageIMessage: async (...args) => {
      const { sendMessageIMessage } = await loadIMessageSenderRuntime();
      return await sendMessageIMessage(...args);
    },
  };
}

export function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps {
  return createOutboundSendDepsFromCliSource(deps);
}

export function logWebSelfId(): void {}
