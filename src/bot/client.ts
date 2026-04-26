import { Client } from "tmi.js";
import { disconnectHandler, handlerMessage } from "./message-processor";
import { getChannel, refreshAuthButton } from "@config";
import { formatChannel } from "@utils";
import { clearAccessToken } from "./auth";

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
    if (typeof error !== "string") return;

    if (error.includes("Login authentication failed")) {
      Spicetify.showNotification(
        "Login authentication failed. Please re-authorize.",
        true,
        30_000, // 30 seconds
      );
      clearAccessToken();
      refreshAuthButton();
    } else {
      Spicetify.showNotification(`Error connecting bot: ${error}`, true);
    }
  }

  if (client.isConnected()) {
    console.info("Bot connected");
    Spicetify.showNotification("Bot connected");
  }

  client.addListener("message", handlerMessage);
  client.addListener("disconnected", disconnectHandler);
}

export async function reconnect() {
  if (!client) {
    return Spicetify.showNotification(
      "Bot is not authorized and not connected to the chat",
    );
  }

  await disconnect();

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

export async function disconnect() {
  try {
    if (!client || !client.isConnected()) {
      return Spicetify.showNotification("Bot is not connected to the chat");
    }

    await client.disconnect();
    console.info("Bot disconnected");
  } catch (error) {
    console.error(`Error disconnecting bot: ${error}`);
    Spicetify.showNotification(`Error disconnecting bot: ${error}`);
  }
}
