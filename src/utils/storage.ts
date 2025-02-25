import settings from "../settings.json";

const PREFIX = `spicetify:${settings.nameId}:`;

export function setStorageItem(key: string, value: string): void {
  Spicetify.LocalStorage.set(PREFIX + key, value);
}

export function getStorageItem(key: string): string | null {
  return Spicetify.LocalStorage.get(PREFIX + key);
}

export function removeStorageItem(key: string): void {
  Spicetify.LocalStorage.remove(PREFIX + key);
}
