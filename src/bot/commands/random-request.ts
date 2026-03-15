import { notification, reply } from "@bot/responses";
import { checkLimits } from "@services/limits";
import {
  pickRandomTrack,
  RandomSourceErrorCode,
} from "@services/random-request";
import { queue } from "@services/queue";
import { isModOrBroadcaster } from "@utils";
import type { CommandExecutor } from "../types";

function mapSourceError(errorCode?: RandomSourceErrorCode) {
  switch (errorCode) {
    case RandomSourceErrorCode.PLAYLIST_NOT_FOUND:
      return reply("rr", "playlistNotFound");
    case RandomSourceErrorCode.ALBUM_NOT_FOUND:
      return reply("rr", "albumNotFound");
    case RandomSourceErrorCode.ARTIST_NOT_FOUND:
      return reply("rr", "artistNotFound");
    case RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES:
      return reply("rr", "noAvailableCandidates");
    case RandomSourceErrorCode.INVALID_SOURCE:
      return reply("rr", "invalidSource");
    default:
      return reply("internal", "error");
  }
}

interface CreateRandomRequestExecutorOptions {
  atFront: boolean;
  requirePriorityPermission: boolean;
}

export function createRandomRequestExecutor(
  options: CreateRandomRequestExecutorOptions,
): CommandExecutor {
  const { atFront, requirePriorityPermission } = options;

  return async function (client, author, args, tags) {
    if (requirePriorityPermission) {
      const isSubscriber = !!tags.subscriber;
      const canUseCommand =
        isModOrBroadcaster(client, author.userName, tags) || isSubscriber;

      if (!canUseCommand) {
        return reply("rrn", "noPermission");
      }
    }

    const limit = checkLimits(author.id);
    if (!limit.canBeAdded) {
      const key = limit.reached === "queue" ? "queueLimit" : "userLimit";
      return reply("sr", key, limit);
    }

    const result = await pickRandomTrack(args);

    if (!result.track) {
      return mapSourceError(result.errorCode);
    }

    const addedTrack = await queue.addTrack(author.id, result.track, atFront);

    return [
      notification("rr", "userAddedTrack", author, addedTrack),
      reply("rr", "addedTrack", addedTrack),
    ];
  };
}
