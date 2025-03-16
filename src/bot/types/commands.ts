import type { Client, ChatUserstate } from "tmi.js";

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
) => Promise<void>;

export type CommandName = string;
