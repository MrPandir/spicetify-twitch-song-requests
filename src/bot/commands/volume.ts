import { reply } from "@bot";
import type { CommandExecutor } from "../types";

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;

function getCurrentVolumePercent(): number {
  return Math.round(Spicetify.Player.getVolume() * 100);
}

function clampVolume(value: number): number {
  return Math.min(MAX_VOLUME, Math.max(MIN_VOLUME, value));
}

function parseVolumeInput(input: string, currentVolume: number): number | null {
  const normalizedInput = input.trim().replace(/%$/, "");

  if (normalizedInput.length === 0) {
    return null;
  }

  const firstChar = normalizedInput[0];
  const isDelta = firstChar === "+" || firstChar === "-";
  const value = Number(normalizedInput);

  if (!Number.isFinite(value)) {
    return null;
  }

  return clampVolume(
    isDelta ? currentVolume + Math.round(value) : Math.round(value),
  );
}

const executor: CommandExecutor = async function (author, args, tags) {
  if (args.length === 0) {
    return reply("volume", "current", getCurrentVolumePercent());
  }

  const previousVolume = getCurrentVolumePercent();
  const volume = parseVolumeInput(args[0], previousVolume);

  if (volume === null) {
    return reply("volume", "current", previousVolume);
  }

  Spicetify.Player.setVolume(volume / 100);

  return reply("volume", "updated", previousVolume, volume);
};

export default executor;
