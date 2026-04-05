import { reply } from "@bot";
import type { CommandExecutor } from "../types";

const nextOptions: Omit<Spicetify.SkipTrackOptions, "allowSeeking"> = {
  loggingParams: {
    commandId: undefined,
    commandInitiatedTime: {
      value: BigInt(0),
    },
    commandReceivedTime: undefined,
    deviceIdentifier: "",
    interactionIds: [],
    pageInstanceIds: [],
  },
  options: undefined,
  track: undefined,
};

const executor: CommandExecutor = async function () {
  nextOptions.loggingParams.commandInitiatedTime = {
    value: BigInt(Date.now()),
  };
  const result =
    await Spicetify.Player.origin._contextPlayer.skipNext(nextOptions);

  if (result.error === 0) {
    return reply("next", "success");
  }

  if (result.reasons.includes("not_playing_track")) {
    return reply("next", "notPlayingTrack");
  }

  if (result.reasons.includes("no_next_track")) {
    return reply("next", "noNextTrack");
  }

  throw new Error(
    `Failed to skip next track: error=${result.error}, reasons=${result.reasons}`,
  );
};

export default executor;
