import { searchTrack } from "@api/spotify";
import { notification, reply } from "@bot/responses";
import { Track } from "@entities/track";
import { queue } from "@services/queue";
import { getTracksFromLinks } from "@services/url-handlers";
import type { CommandExecutor } from "../types/commands";

// TODO: Add a check if the track is already in the queue.
// BUG: Unavailable track says it's being added, but it's not happening.
// TODO: Check for queue limit

const executor: CommandExecutor = async function (client, author, args, tags) {
  if (!args.length) {
    return reply("sr", "noArgs");
  }

  // Link processing and adding

  const result = await getTracksFromLinks(args);

  if (result.detected) {
    const addedTracks = queue.addTracks(author.id, result.tracks);

    if (addedTracks.length === 1) {
      const track = addedTracks[0];
      return [
        notification("sr", "userAddedTrack", author, track),
        reply("sr", "addedTrack", track),
      ];
    }

    if (addedTracks.length === 0) {
      return reply("sr", "notTracks");
    }

    return [
      notification("sr", "userAddedTracks", author, addedTracks.length),
      reply("sr", "addedTracks", addedTracks.length),
    ];
  }

  // Search and add by track name

  const searchQuery = args.join(" ");
  const track = await searchTrack(searchQuery);

  if (!track || !track.name) {
    console.log(`Track not found with query: "${searchQuery}"`);
    return reply("sr", "trackNotFound");
  }

  console.info(`Track found: ${track.name} by ${track.artists[0].name}`);

  const addedTrack = queue.addTrack(author.id, Track.fromSpotifyTrack(track));

  return [
    notification("sr", "userAddedTrack", author, addedTrack),
    reply("sr", "addedTrack", addedTrack),
  ];
};

export default executor;
