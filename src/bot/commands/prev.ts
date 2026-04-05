import { reply } from "@bot";
import type { CommandExecutor } from "../types";

const prevOptions: Spicetify.SkipTrackOptions = {
  allowSeeking: false,
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
  prevOptions.loggingParams.commandInitiatedTime = {
    value: BigInt(Date.now()),
  };
  const result =
    await Spicetify.Player.origin._contextPlayer.skipPrev(prevOptions);

  if (result.error === 0) {
    return reply("prev", "success");
  }

  if (result.reasons.includes("not_playing_track")) {
    return reply("prev", "notPlayingTrack");
  }

  if (result.reasons.includes("no_prev_track")) {
    return reply("prev", "noPrevTrack");
  }

  throw new Error(
    `Failed to skip previous track: error=${result.error}, reasons=${result.reasons}`,
  );
};

export default executor;
