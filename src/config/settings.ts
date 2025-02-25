import { SettingsSection } from "spcr-settings";
import { reconnect } from "../bot";

export const settings = new SettingsSection("Twitch Spotifi", "twitch-spotifi");

export async function addSettings() {
  settings.addInput("channel", "Nickname channel", "");
  settings.addButton(
    "reconnect",
    "Twitch Bot Reconnect",
    "Reconnect",
    reconnect,
  );
  await settings.pushSettings();
}
