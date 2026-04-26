import { SettingsSection } from "spcr-settings";
import { reconnect, disconnect } from "@bot";
import { Language } from "@locales";
import { nameId } from "@settings.json";
import {
  getAuthButtonText,
  handleAuthButtonClick,
  registerAuthButtonRerender,
} from "@ui";
import { addPermissionScopesSettings } from "./permission-settings";

export const settings = new SettingsSection("Twitch Song Requests", nameId);
const authButtonId = "toggleBotAuth";

export function refreshAuthButton() {
  const authButton = settings.settingsFields[authButtonId];

  if (authButton?.type !== "button") return;

  authButton.value = getAuthButtonText();
  settings.rerender();
}

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
    authButtonId,
    "Login/Logout Twitch Bot",
    getAuthButtonText(),
    () =>
      handleAuthButtonClick(getChannel, (channel) => {
        settings.setFieldValue("channel", channel);
      }),
  );

  settings.addHidden("access_token", null);

  await settings.pushSettings();
  await addPermissionScopesSettings();
  registerAuthButtonRerender(refreshAuthButton);
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
