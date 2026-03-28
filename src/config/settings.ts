import { SettingsSection } from "spcr-settings";
import { clearAccessToken, disconnect, reconnect } from "@bot";
import { Language } from "@locales";
import { nameId } from "@settings.json";
import { addPermissionScopesSettings } from "./permission-settings";

export const settings = new SettingsSection("Twitch Song Requests", nameId);

export async function addSettings() {
  settings.addInput("channel", "Nickname channel");

  settings.addDropDown("language", "Bot language", Object.values(Language), 0);

  settings.addInput("maxTracksPerUser", "Max tracks per user", {
    defaultValue: "-1",
    inputType: "number",
  });

  settings.addInput("maxTracksInQueue", "Max tracks in queue", {
    defaultValue: "-1",
    inputType: "number",
  });

  settings.addToggle(
    "allowDuplicateRandomTracks",
    "Allow !rr/!rrn to add already queued tracks",
    true,
  );

  settings.addButton(
    "reconnect",
    "Reconnect Twitch Bot",
    "Reconnect",
    reconnect,
  );

  settings.addButton(
    "disconnect",
    "Disconnect Twitch Bot",
    "Disconnect",
    disconnect,
  );

  settings.addButton(
    "clearBotToken",
    "Remove Twitch Bot Token",
    "Logout",
    clearAccessToken,
  );

  settings.addHidden("access_token", null);

  await settings.pushSettings();
  await addPermissionScopesSettings();
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

export function getAllowDuplicateRandomTracks(): boolean {
  return !!settings.getFieldValue("allowDuplicateRandomTracks");
}
