import type { ChatUserstate } from "tmi.js";
import { client } from "@bot/client";

const SETUP_REWARD_PREFIX = "Setup New Reward:";

let isSetupActive = false;

export function isRewardSetupActive(): boolean {
  return isSetupActive;
}

export function startRewardSetup(): void {
  isSetupActive = true;
}

export function stopRewardSetup(): void {
  isSetupActive = false;
}

export function finishRewardSetup(rewardId: string, title: string): void {
  if (!rewardId || !title.trim()) {
    return;
  }

  console.log("Setup reward is complete:", rewardId, title);

  isSetupActive = false;
}

export function isRewardSetupMessage(message: string): boolean {
  return message
    .trimStart()
    .toLowerCase()
    .startsWith(SETUP_REWARD_PREFIX.toLowerCase());
}

export function getRewardSetupTitle(message: string): string | null {
  if (!isRewardSetupMessage(message)) {
    return null;
  }

  const normalizedMessage = message.trimStart();
  const title = normalizedMessage.slice(SETUP_REWARD_PREFIX.length).trim();

  return title || null;
}

export function getRewardSetupPrefix(): string {
  return SETUP_REWARD_PREFIX;
}

export function tryFinishRewardSetup(
  tags: ChatUserstate,
  message: string,
): boolean {
  if (!isRewardSetupActive()) {
    return false;
  }

  if (!tags.username || !client.isBroadcaster(tags.username)) {
    return false;
  }

  const rewardId: string | null = tags["custom-reward-id"];

  if (!rewardId) {
    return false;
  }

  const title = getRewardSetupTitle(message);

  if (!title) {
    return false;
  }

  finishRewardSetup(rewardId, title);
  Spicetify.showNotification(`Reward "${title}" added`, false, 10_000);
  return true;
}
