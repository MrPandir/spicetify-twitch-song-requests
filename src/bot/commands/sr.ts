import { searchTrack } from "@api/spotify";
import { Track } from "@entities/track";
import { queue } from "@services/queue";
import { getTracksFromLinks } from "@services/url-handlers";
import { Command } from "../types";

// TODO: Add a check if the track is already in the queue.
// BUG: Unavailable track says it's being added, but it's not happening.
// TODO: Check for queue limit

export const sr: Command = {
  permission: "USER",
  async execute({ client, author, args, tags }) {
    if (!args.length) {
      client.reply(tags["id"], "Please provide a track name or URL");
      return;
    }

    // Link processing and adding

    const result = await getTracksFromLinks(args);

    if (result.detected) {
      const addedTracks = queue.addTracks(author.id, result.tracks);

      if (addedTracks.length === 1) {
        const track = addedTracks[0];
        Spicetify.showNotification(
          `${author.displayName} added "${track.title}" to the queue`,
        );
        client.reply(tags["id"], `Added "${track.title}" to the queue`);
        return;
      }

      if (addedTracks.length === 0) {
        client.reply(tags["id"], `These are not tracks`);
        return;
      }

      Spicetify.showNotification(
        `${author.displayName} added ${addedTracks.length} tracks to the queue`,
      );
      client.reply(tags["id"], `${addedTracks.length} tracks added to queue`);
      return;
    }

    // Search and add by track name

    const searchQuery = args.join(" ");
    const track = await searchTrack(searchQuery);

    if (!track || !track.name) {
      console.log(`Track not found with query: "${searchQuery}"`);
      client.reply(tags["id"], "No track found");
      return;
    }

    console.info(`Track found: ${track.name} by ${track.artists[0].name}`);

    const addedTrack = queue.addTrack(author.id, Track.fromSpotifyTrack(track));

    Spicetify.showNotification(
      `${author.displayName} added "${addedTrack.title}" to the queue`,
    );
    client.reply(tags["id"], `Added "${addedTrack.title}" to the queue`);
  },
};

export default sr;
