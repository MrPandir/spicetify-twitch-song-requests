import { PREFIX } from "@config";
import type { ChatUserstate } from "tmi.js";
import { client } from "./client";
import { commands } from "./commands";
import type { CommandExecutor, User } from "./types";

export function handlerMessage(
  channel: string,
  tags: ChatUserstate,
  message: string,
  self: boolean,
) {
  if (!message.startsWith(PREFIX)) return;

  const [rawCommand, ...args] = message.split(" ");
  const command = rawCommand.slice(1); // remove prefix

  const executor: CommandExecutor | undefined = commands[command];
  if (!executor) return;

  if (!tags["user-id"] || !tags["username"] || !tags["display-name"]) {
    console.warn("Missing user information");
    return;
  }

  const user: User = {
    id: tags["user-id"],
    userName: tags["username"],
    displayName: tags["display-name"],
  };

  executor(client, user, args, tags);
}
