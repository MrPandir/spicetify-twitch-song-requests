import { getMaxTracksPerUser, getMaxTracksInQueue } from "@config/settings";
import { queue } from "@services/queue";
import { Track, TwitchUserId } from "@entities";
import type { LimitInfo, ApplyLimitsResult } from "./types";

function checkUserLimit(userId: TwitchUserId): LimitInfo {
  const maxTracksPerUser = getMaxTracksPerUser();
  const userTracks = queue.getTracksByUser(userId);
  const currentUserCount = userTracks.length;

  const maxCanAdd = Math.max(0, maxTracksPerUser - currentUserCount);

  return {
    max: maxTracksPerUser,
    current: currentUserCount,
    canBeAdded: maxCanAdd,
    reached: "user",
  };
}

function checkQueueLimit(): LimitInfo {
  const maxQueueSize = getMaxTracksInQueue();
  const allTracks = queue.getAllTracks();
  const currentQueueSize = allTracks.length;

  const maxCanAdd = Math.max(0, maxQueueSize - currentQueueSize);

  return {
    max: maxQueueSize,
    current: currentQueueSize,
    canBeAdded: maxCanAdd,
    reached: "queue",
  };
}

export function checkLimits(userId: TwitchUserId): LimitInfo {
  const queueLimit = checkQueueLimit();
  const userLimit = checkUserLimit(userId);

  // User limit first, then queue limit
  if (userLimit.canBeAdded < queueLimit.canBeAdded) return userLimit;

  return queueLimit;
}

export function applyLimits(
  userId: TwitchUserId,
  tracks: Track[],
): ApplyLimitsResult {
  const limit = checkLimits(userId);

  return {
    tracksToAdd: tracks.slice(0, limit.canBeAdded),
    tracksRejected: tracks.slice(limit.canBeAdded),
    limit,
  };
}
