import settings from "@settings.json";
import type { StorageKey } from "@/types/storage";

const PREFIX = `spicetify:${settings.nameId}:`;

export function setStorageItem(key: StorageKey, value: string): void {
  Spicetify.LocalStorage.set(PREFIX + key, value);
}

export function getStorageItem(key: StorageKey): string | null {
  return Spicetify.LocalStorage.get(PREFIX + key);
}

export function removeStorageItem(key: StorageKey): void {
  Spicetify.LocalStorage.remove(PREFIX + key);
}
