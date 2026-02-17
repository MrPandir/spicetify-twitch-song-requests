import type { ChatUserstate, Client } from "tmi.js";

export function isModOrBroadcaster(
  client: Client,
  username: string,
  tags: ChatUserstate,
): boolean {
  const isMod = !!tags.mod;
  const isBroadcaster = client.isBroadcaster(username);
  return isMod || isBroadcaster;
}
