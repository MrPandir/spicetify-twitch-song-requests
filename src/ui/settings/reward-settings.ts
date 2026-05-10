import { SettingsSection } from "spcr-settings";
import { nameId } from "@settings.json";
import { commandDefinitions } from "@config/command-settings";

export const channelPointRewards = new SettingsSection(
  "Twitch Song Requests (Channel Point Rewards)",
  nameId + "-channel-point-rewards",
);

export async function addChannelPointRewardsSettings() {
  for (const definition of commandDefinitions) {
    channelPointRewards.addDropDown(
      definition.command,
      definition.shortDescription,
      ["Disabled"],
      0,
    );
  }

  await channelPointRewards.pushSettings();
}

export function getChannelPointReward(command: string): string | null {
  return channelPointRewards.getFieldValue(command) ?? null;
}
