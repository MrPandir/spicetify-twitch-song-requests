import { Client } from "tmi.js";
import { PatchedClient, InternalClient } from "./types";

export function patchClient(client: Client): PatchedClient {
  (client as PatchedClient).replay = async function (
    parentMessageId: string,
    message: string,
  ): Promise<void> {
    const channel = client.getChannels()[0];
    const command = `@reply-parent-msg-id=${parentMessageId} PRIVMSG ${channel} :${message}`;
    return (client as InternalClient)._sendCommand(null, null, command);
  };

  return client as PatchedClient;
}
