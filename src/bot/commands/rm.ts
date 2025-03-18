import { queue } from "@services/queue";
import { reply } from "@bot";
import { CommandExecutor } from "../types";

// TODO: Implement deletion by spotify link

const executor: CommandExecutor = async function (client, author, args, tags) {
  // Check if queue is empty
  if (queue.getTracksByUser(author.id).length === 0) {
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
  // TODO: Implement deletion for admin (optional)
  const deletedTrack = queue.removeTrack(author.id, args.join(" "));
  if (!deletedTrack) {
    return reply("rm", "trackNotFound");
  }

  return reply("rm", "trackDeleted", deletedTrack);
};

export default executor;
