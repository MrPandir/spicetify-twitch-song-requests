import { SettingsSection } from "spcr-settings";
import { reconnect } from "@bot";
import type { Language } from "@locales";

const settings = new SettingsSection("Twitch Spotifi", "twitch-spotifi");

export async function addSettings() {
  settings.addInput("channel", "Nickname channel", "");

  settings.addDropDown("language", "Bot language", ["EN", "RU"], 0);

  settings.addButton(
    "reconnect",
    "Twitch Bot Reconnect",
    "Reconnect",
    reconnect,
  );

  await settings.pushSettings();
}

export function getChannel(): string {
  return settings.getFieldValue("channel");
}

export function getLanguage(): Language {
  return settings.getFieldValue("language") || "EN";
}
