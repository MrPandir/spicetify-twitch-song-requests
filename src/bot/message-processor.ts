import { clearAccessToken, reply } from "@bot";
import { PREFIX } from "@config";
import { refreshAuthButton } from "@ui/settings";
import {
  refreshChannelPointRewardsSettings,
  refreshRewardSetupButton,
} from "@ui/settings/reward-settings";
import { canExecuteCommand } from "@features/command-permissions";
import { rewardCatalog } from "@config/reward-catalog";
import { tryFinishRewardSetup } from "@features/channel-point-rewards/setup";
import type { ChatUserstate } from "tmi.js";
import { client } from "./client";
import { commands } from "./commands";
import type { BotResponse, CommandExecutor, User } from "./types";

export function handlerMessage(
  channel: string,
  tags: ChatUserstate,
  message: string,
  self: boolean,
) {
  if (tryFinishRewardSetup(tags, message)) {
    refreshRewardSetupButton();
    refreshChannelPointRewardsSettings();
  }

  const rewardId = tags["custom-reward-id"];
  const rewardCommand = rewardId ? rewardCatalog.getCommand(rewardId) : null;

  if (rewardCommand) {
    return executeCommandByName(rewardCommand, getArgs(message), tags);
  }

  if (!message.startsWith(PREFIX)) return;

  const [rawCommand, ...args] = getArgs(message);
  const command = rawCommand.toLowerCase().slice(1); // remove prefix

  void executeCommandByName(command, args, tags);
}

async function executeCommandByName(
  command: string,
  args: string[],
  tags: ChatUserstate,
  checkPermissions: boolean = true,
): Promise<void> {
  const executor: CommandExecutor | undefined = commands[command];
  if (!executor) return;

  const user = getUser(tags);
  if (!user) return;

  if (checkPermissions && !canExecuteCommand(command, user)) {
    await sendResponses([reply("internal", "permissionDenied")], tags.id);
    return;
  }

  await executeCommand(executor, user, args, tags);
}

function getArgs(message: string): string[] {
  const trimmedMessage = message.trim();
  return trimmedMessage.length ? trimmedMessage.split(/\s+/) : [];
}

function getUser(tags: ChatUserstate): User | null {
  if (!tags["user-id"] || !tags["username"] || !tags["display-name"]) {
    console.warn("Missing user information");
    return null;
  }

  return {
    id: tags["user-id"],
    userName: tags["username"],
    displayName: tags["display-name"],
    isBroadcaster: client.isBroadcaster(tags["username"]),
    isModerator: !!tags.mod,
    isSubscriber: !!tags.subscriber,
    isVip: !!tags.vip,
  };
}

async function executeCommand(
  executor: CommandExecutor,
  user: User,
  args: string[],
  tags: ChatUserstate,
): Promise<void> {
  try {
    const result = await executor(user, args, tags);

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
    clearAccessToken();
    refreshAuthButton();
  } else {
    Spicetify.showNotification("Disconnected from Twitch", true);
  }
}
