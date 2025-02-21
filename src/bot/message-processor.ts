import type { ChatUserstate } from "tmi.js";
import type { CommandExecute, CommandContext, User } from "./types";
import { PREFIX } from "../config";
import { client } from "./client";
import { commands } from "./commands";

export function handlerMessage(
  channel: string,
  tags: ChatUserstate,
  message: string,
  self: boolean,
) {
  if (!message.startsWith(PREFIX)) return;

  const [rawCommand, ...args] = message.split(" ");
  const command = rawCommand.slice(1); // remove prefix

  const executor: CommandExecute | undefined = commands[command];
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

  const data: CommandContext = { client, author: user, args, tags };

  executor(data);
}
