import { client } from "@bot/client";
import { Track } from "@entities/track";
import { queue } from "@services/queue";
import { CommandExecutor } from "../types";

// TODO: Implement deletion by spotify link

async function sayTrackDeleted(parentMessageId: string, track: Track | null) {
  if (!track) {
    await client.reply(parentMessageId, "Track not found");
    return;
  }

  await client.reply(parentMessageId, `Track "${track.title}" deleted`);
}

const executor: CommandExecutor = async function (client, author, args, tags) {
  // Check if queue is empty
  if (queue.getTracksByUser(author.id).length === 0) {
    await client.reply(tags["id"], "Your queue is empty");
    return;
  }

  // Delete last track from queue
  if (args.length == 0) {
    const deletedTrack = queue.removeTrack(author.id, 1);
    await sayTrackDeleted(tags["id"], deletedTrack);
    return;
  }

  // Delete track by index from end of queue
  if (args.length == 1) {
    const endIndex = Number(args[0]);

    if (!isNaN(endIndex) && isFinite(endIndex)) {
      const deletedTrack = queue.removeTrack(author.id, endIndex);
      await sayTrackDeleted(tags["id"], deletedTrack);
      return;
    }
  }

  // Delete track by title or artists from queue
  if (args.length >= 1) {
    // TODO: Implement deletion for admin (optional)

    const deletedTrack = queue.removeTrack(author.id, args.join(" "));
    await sayTrackDeleted(tags["id"], deletedTrack);
    return;
  }
};

export default executor;
