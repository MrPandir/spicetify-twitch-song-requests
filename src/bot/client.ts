import tmi from "tmi.js";
import type { PatchedClient } from "./types";
import { handlerMessage } from "./message-processor";
import { patchClient } from "./patch";
import { settings } from "../config";

export let client: PatchedClient;

export async function initNewBot() {
  console.info("Relogin bot");
  if (client && client.readyState() === "OPEN") {
    console.info("Disconnecting bot and removing listeners");
    await client.disconnect();
    client.removeAllListeners();
  }

  client = new tmi.Client({
    options: {
      skipUpdatingEmotesets: true,
    },
    channels: [settings.getFieldValue("channel")],
    identity: {
      username: "Bot",
      password: "oauth:" + settings.getFieldValue("bot-token"),
    },
  }) as PatchedClient;

  try {
    await client.connect();
  } catch (error: unknown) {
    console.error("Error connecting bot:", error);
    if (typeof error === "string") {
      Spicetify.showNotification(`Error connecting bot: ${error}`, true);
    }
  }

  if (client.readyState() === "OPEN") {
    console.info("Bot connected");
    Spicetify.showNotification("Bot connected");
  }

  client.addListener("message", handlerMessage);

  patchClient(client);
}
