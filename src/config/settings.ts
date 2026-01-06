import { SettingsSection } from "spcr-settings";
import { reconnect } from "@bot";
import { Language } from "@locales";
import { nameId } from "@settings.json";

export const settings = new SettingsSection("Twitch Song Requests", nameId);

export async function addSettings() {
  settings.addInput("channel", "Nickname channel", "");

  settings.addDropDown("language", "Bot language", Object.values(Language), 0);

  settings.addInput("maxTracksPerUser", "Max tracks per user", "-1");

  settings.addInput("maxTracksInQueue", "Max tracks in queue", "-1");

  settings.addButton(
    "reconnect",
    "Twitch Bot Reconnect",
    "Reconnect",
    reconnect,
  );

  settings.addHidden("access_token", null);

  // Migration from the old extension
  const oldValue = Spicetify.LocalStorage.get(
    "spicetify:twitch-spotifi:access_token",
  );
  if (oldValue) {
    settings.setFieldValue("access_token", oldValue);
    Spicetify.LocalStorage.remove("spicetify:twitch-spotifi:access_token");
  }

  await settings.pushSettings("twitch-spotifi");
}

export function getChannel(): string {
  return settings.getFieldValue("channel");
}

export function getLanguage(): Language {
  return settings.getFieldValue("language") || "EN";
}

export function getMaxTracksPerUser(): number {
  const value = settings.getFieldValue("maxTracksPerUser") as string;
  if (value.startsWith("-")) {
    return 1_000_000_000;
  }
  return Math.max(0, parseInt(value) || 0);
}

export function getMaxTracksInQueue(): number {
  const value = settings.getFieldValue("maxTracksInQueue") as string;
  if (value.startsWith("-")) {
    return 1_000_000_000;
  }
  return Math.max(0, parseInt(value) || 0);
}
