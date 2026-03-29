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

const executor: CommandExecutor = async function (client, author, args, tags) {
  if (args.length === 0) {
    return reply("volume", "current", getCurrentVolumePercent());
  }

  const previousVolume = getCurrentVolumePercent();
  const normalizedInput = args[0].trim().replace(/%$/, "");
  const input = Number(normalizedInput);

  if (!Number.isFinite(input)) {
    return reply("volume", "current", previousVolume);
  }

  const volume = clampVolume(Math.round(input));

  Spicetify.Player.setVolume(volume / 100);

  return reply("volume", "updated", previousVolume, volume);
};

export default executor;
