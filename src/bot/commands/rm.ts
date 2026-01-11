import { queue } from "@services/queue";
import { reply } from "@bot";
import type { BotResponse, CommandExecutor, User } from "../types";
import type { ChatUserstate, Client } from "tmi.js";
import { hasText } from "@utils";

// TODO: Implement deletion by spotify link

// Moderator or broadcaster can delete all tracks
function canDeleteGlobal(
  client: Client,
  author: User,
  tags: ChatUserstate,
): boolean {
  const isMod = !!tags.mod;
  const isBroadcaster = client.isBroadcaster(author.userName);
  return isMod || isBroadcaster;
}

function deleteTrackByName(
  author: User,
  args: string[],
  isGlobalDelete: boolean,
): BotResponse {
  const deletedTrack = queue.removeTrack(
    author.id,
    args.join(" "),
    isGlobalDelete,
  );
  if (!deletedTrack) {
    return reply("rm", "trackNotFound");
  }

  return reply("rm", "trackDeleted", deletedTrack);
}

const executor: CommandExecutor = async function (client, author, args, tags) {
  const isGlobalDelete = canDeleteGlobal(client, author, tags);
  const userTrackCount = queue.getTracksByUser(author.id).length;

  // If the user is a moderator or the broadcaster
  // and their queue is empty,
  // then check that text was provided
  // and remove the track by name from the entire queue
  if (userTrackCount === 0 && isGlobalDelete && hasText(...args)) {
    return deleteTrackByName(author, args, isGlobalDelete);
  }

  // Check if queue is empty
  if (userTrackCount === 0) {
    return reply("rm", "emptyQueue");
  }

  // Delete last track from queue
  if (args.length == 0) {
    const deletedTrack = queue.removeTrack(author.id, 1);
    if (!deletedTrack) {
      return reply("rm", "trackNotFound");
    }
    return reply("rm", "trackDeleted", deletedTrack);
  }

  // Delete track by index from end of queue
  if (args.length == 1) {
    const endIndex = Number(args[0]);

    if (!isNaN(endIndex) && isFinite(endIndex)) {
      const deletedTrack = queue.removeTrack(author.id, endIndex);
      if (!deletedTrack) {
        return reply("rm", "trackNotFound");
      }
      return reply("rm", "trackDeleted", deletedTrack);
    }
  }

  // Delete track by title or artists from queue
  return deleteTrackByName(author, args, isGlobalDelete);
};

export default executor;
