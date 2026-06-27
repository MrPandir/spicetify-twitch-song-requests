import { SettingsSection } from "spcr-settings";
import { nameId } from "@settings.json";
import { commandDefinitions } from "@config/command-settings";
import { rewardCatalog } from "@config/reward-catalog";
import { isBotConnected } from "@bot/client";
import {
  getRewardSetupPrefix,
  isRewardSetupActive,
  startRewardSetup,
  stopRewardSetup,
} from "@features/channel-point-rewards/setup";

export const channelPointRewards = new SettingsSection(
  "Twitch Song Requests (Channel Point Rewards)",
  nameId + "-channel-point-rewards",
);

const DISABLED_REWARD_OPTION = "Disabled";
const rewardSetupButtonId = "setupNewReward";

export function getRewardSetupButtonText(): string {
  return isRewardSetupActive() ? "Stop Setup Reward" : "Setup New Reward";
}

export function refreshRewardSetupButton() {
  const rewardSetupButton =
    channelPointRewards.settingsFields[rewardSetupButtonId];

  if (rewardSetupButton?.type !== "button") return;

  rewardSetupButton.value = getRewardSetupButtonText();
  channelPointRewards.rerender();
}

function getRewardOptionsForCommand(command: string): string[] {
  const options = [DISABLED_REWARD_OPTION, ...rewardCatalog.getFreeRewards()];

  const currentReward = rewardCatalog.getRewardNameByCommand(command);
  if (currentReward) {
    options.push(currentReward);
  }

  return options;
}

function getSelectedIndex(options: string[], value: string | null): number {
  if (!value) {
    return 0;
  }

  const index = options.indexOf(value);
  return index >= 0 ? index : 0;
}

export function refreshChannelPointRewardsSettings() {
  for (const definition of commandDefinitions) {
    const field = channelPointRewards.settingsFields[definition.command];

    if (field?.type !== "dropdown") continue;

    field.options = getRewardOptionsForCommand(definition.command);
  }

  channelPointRewards.rerender();
}

export async function addChannelPointRewardsSettings() {
  channelPointRewards.addButton(
    rewardSetupButtonId,
    "Add a new reward to the list",
    getRewardSetupButtonText(),
    () => {
      if (isRewardSetupActive()) {
        stopRewardSetup();
        refreshRewardSetupButton();
        return;
      }

      if (!isBotConnected()) {
        Spicetify.showNotification(
          "No chat connection. Connect to Twitch chat first.",
          true,
        );
        return;
      }

      startRewardSetup();
      refreshRewardSetupButton();
      Spicetify.showNotification(
        `Redeem the channel point reward with text: ${getRewardSetupPrefix()} Name reward.`,
        false,
        20_000,
      );
    },
  );

  for (const definition of commandDefinitions) {
    const options = getRewardOptionsForCommand(definition.command);
    const currentReward = rewardCatalog.getRewardNameByCommand(
      definition.command,
    );

    channelPointRewards.addDropDown(
      definition.command,
      definition.shortDescription,
      options,
      getSelectedIndex(options, currentReward),
      undefined,
      {
        onChange: (event) => {
          const latestOptions = getRewardOptionsForCommand(definition.command);
          const selectedReward =
            latestOptions[event.currentTarget.selectedIndex] ??
            DISABLED_REWARD_OPTION;

          rewardCatalog.clearCommand(definition.command);

          if (selectedReward !== DISABLED_REWARD_OPTION) {
            rewardCatalog.setCommand(definition.command, selectedReward);
          }

          refreshChannelPointRewardsSettings();
        },
      },
    );
  }

  await channelPointRewards.pushSettings();
}
