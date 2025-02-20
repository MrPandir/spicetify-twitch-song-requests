import { SettingsSection } from "spcr-settings";
import { new_bot_client } from "./bot";

export const settings = new SettingsSection("Twitch Spotifi", "twitch-spotifi");

export async function addSettings() {
  settings.addInput("channel", "Nickname channel", "");
  settings.addInput("bot-token", "Authorization token", "yuq...ft1");
  settings.addButton(
    "relogin",
    "Relogin twitch bot",
    "Relogin",
    new_bot_client,
  );
  await settings.pushSettings();
}
