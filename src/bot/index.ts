import tmi from "tmi.js";
import { handlerMessage } from "./message-processor";
import { settings } from "../settings";
import { PatchedClient } from "./types";
import { patchClient } from "./patch";

export let client: PatchedClient;

export async function new_bot_client() {
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
  await client.connect();
  client.addListener("message", handlerMessage);

  patchClient(client);

  // const originalSay = client.say;
  // client.say = async function (
  //   messageOrChannel: string,
  //   maybeMessage?: string,
  // ): Promise<[string]> {
  //   if (maybeMessage === undefined) {
  //     const channel = this.getChannels()[0];
  //     return originalSay.call(this, channel, messageOrChannel);
  //   }
  //   return originalSay.call(this, messageOrChannel, maybeMessage);
  // };
}
