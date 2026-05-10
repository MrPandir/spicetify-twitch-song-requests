import { SettingsSection } from "spcr-settings";
import { nameId } from "@settings.json";
import { commandDefinitions } from "@config/command-settings";
import {
  getRewardSetupPrefix,
  startRewardSetup,
} from "@features/channel-point-rewards/setup";

export const channelPointRewards = new SettingsSection(
  "Twitch Song Requests (Channel Point Rewards)",
  nameId + "-channel-point-rewards",
);

const DISABLED_REWARD_OPTION = "Disabled";

export async function addChannelPointRewardsSettings() {
  channelPointRewards.addButton(
    "setupNewReward",
    "Add a new reward to the list",
    "Setup New Reward",
    () => {
      startRewardSetup();
      Spicetify.showNotification(
        `Redeem the channel point reward with text: ${getRewardSetupPrefix()} Name reward.`,
        false,
        20_000,
      );
    },
  );

  for (const definition of commandDefinitions) {
    channelPointRewards.addDropDown(
      definition.command,
      definition.shortDescription,
      [DISABLED_REWARD_OPTION],
      0,
    );
  }

  await channelPointRewards.pushSettings();
}

export function getChannelPointReward(command: string): string | null {
  const reward = channelPointRewards.getFieldValue<string>(command);

  if (!reward || reward === DISABLED_REWARD_OPTION) {
    return null;
  }

  return reward;
}
