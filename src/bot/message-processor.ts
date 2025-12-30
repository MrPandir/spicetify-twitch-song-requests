import { clearAccessToken, reply } from "@bot";
import { PREFIX } from "@config";
import type { ChatUserstate } from "tmi.js";
import { client } from "./client";
import { commands } from "./commands";
import type { BotResponse, CommandExecutor, User } from "./types";
import main from "@app";

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

  executeCommand(executor, user, args, tags);
}

async function executeCommand(
  executor: CommandExecutor,
  user: User,
  args: string[],
  tags: ChatUserstate,
): Promise<void> {
  try {
    const result = await executor(client, user, args, tags);

    if (result) {
      await sendResponses(Array.isArray(result) ? result : [result], tags.id);
    }
  } catch (error) {
    console.error("Error executing command:", error);
    await sendResponses([reply("internal", "error")], tags.id);
  }
}

async function sendResponses(
  responses: BotResponse[],
  messageId: string,
): Promise<void> {
  for (const response of responses) {
    const { type, text } = response;

    switch (type) {
      case "reply":
        await client.reply(messageId, text);
        break;
      case "message":
        await client.say(text);
        break;
      case "notification":
        Spicetify.showNotification(text);
        break;
    }
  }
}

export function disconnectHandler(reason: string) {
  console.log("Disconnected from Twitch:", reason);
  if (reason === "Login authentication failed") {
    Spicetify.showNotification(
      "Authentication failed. Please re-authorize.",
      true,
      30_000, // 30 seconds
    );
    // KLUDGE: Call to main for re-authentication. Rewrite to use error throwing or emit event.
    clearAccessToken();
    main();
  } else {
    Spicetify.showNotification("Disconnected from Twitch", true);
  }
}
