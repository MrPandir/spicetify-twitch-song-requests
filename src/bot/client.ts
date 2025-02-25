import tmi from "tmi.js";
import type { PatchedClient } from "./types";
import { handlerMessage } from "./message-processor";
import { patchClient } from "./patch";

export let client: PatchedClient;

export async function initNewBot(token: string, channel: string) {
  if (client && client.readyState() === "OPEN") {
    console.info("Disconnecting bot and removing listeners");
    await client.disconnect();
    client.removeAllListeners();
  }

  client = new tmi.Client({
    options: {
      skipUpdatingEmotesets: true,
    },
    channels: [channel],
    identity: {
      username: "Bot",
      password: "oauth:" + token,
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

export function reconnect() {
  client.disconnect().then(() => {
    client
      .connect()
      .then(() => {
        console.info("Bot reconnected");
        Spicetify.showNotification("Bot reconnected");
      })
      .catch((error: unknown) => {
        console.error("Error reconnecting bot:", error);
        if (typeof error === "string") {
          Spicetify.showNotification(`Error reconnecting bot: ${error}`, true);
        }
      });
  });
}
