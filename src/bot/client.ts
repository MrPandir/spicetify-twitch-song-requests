import { Client } from "tmi.js";
import { handlerMessage } from "./message-processor";
import { getChannel } from "@config";
import { formatChannel } from "@utils";

export let client: Client;

export async function initNewBot(token: string, channel: string) {
  if (client && client.isConnected()) {
    console.info("Disconnecting bot and removing listeners");
    try {
      await client.disconnect();
    } catch {}
    client.removeAllListeners();
  }

  client = new Client({
    options: {
      skipUpdatingEmotesets: true,
    },
    channels: [channel],
    identity: {
      username: "Bot",
      password: "oauth:" + token,
    },
  });

  try {
    await client.connect();
  } catch (error: unknown) {
    console.error("Error connecting bot:", error);
    if (typeof error === "string") {
      Spicetify.showNotification(`Error connecting bot: ${error}`, true);
    }
  }

  if (client.isConnected()) {
    console.info("Bot connected");
    Spicetify.showNotification("Bot connected");
  }

  client.addListener("message", handlerMessage);
}

export async function reconnect() {
  try {
    await client.disconnect();
  } catch {}

  client.opts.channels = [formatChannel(getChannel())];
  client.channels = [];

  await client
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
}
