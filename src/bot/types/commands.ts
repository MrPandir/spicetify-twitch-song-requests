import type { Client, ChatUserstate } from "tmi.js";
import type { BotResponse } from ".";

export interface User {
  id: string;
  userName: string;
  displayName: string;
}

export type CommandExecutor = (
  client: Client,
  author: User,
  args: string[],
  tags: ChatUserstate,
) => Promise<BotResponse | BotResponse[]>;

export type CommandName = string;
