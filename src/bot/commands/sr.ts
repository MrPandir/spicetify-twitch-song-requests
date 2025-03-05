import { Command } from "../types";
import { getUrisFromMessage } from "@services/url-handlers";
import { searchTrack, getTrack } from "@api/spotify";

// TODO: Add a check if the track is already in the queue.
// BUG: Unavailable track says it's being added, but it's not happening.

export const sr: Command = {
  permission: "USER",
  async execute({ client, author, args, tags }) {
    if (!args.length) {
      client.reply(tags["id"], "Please provide a track name or URL");
      return;
    }

    // Link processing and adding

    const result = await getUrisFromMessage(args);

    if (result.detected) {
      console.log("Parsed URIs:", result.uris);

      // TODO: Queue feedback for notifications.
      Spicetify.addToQueue(result.uris.map((uri) => ({ uri: uri.toString() })));

      if (result.length === 1) {
        const trackId = Spicetify.URI.from(result.uris[0])!.id!;
        const track = await getTrack(trackId);

        if (!track) {
          console.error(`Track with ID ${trackId} not found`, track);
          Spicetify.showNotification(`One track added to queue`);
          client.reply(tags["id"], `Track added to queue`);
          return;
        }

        Spicetify.showNotification(
          `${author.displayName} added "${track.name}" to the queue`,
        );
        client.reply(tags["id"], `Added "${track.name}" to the queue`);
        return;
      }

      if (result.length === 0) {
        client.reply(tags["id"], `These are not tracks`);
        return;
      }

      Spicetify.showNotification(
        `${author.displayName} added ${result.length} tracks to the queue`,
      );
      client.reply(tags["id"], `${result.length} tracks added to queue`);
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

    Spicetify.addToQueue([{ uri: track.uri }]);

    // TODO: Check for queue limit

    Spicetify.showNotification(
      `${author.displayName} added "${track.name}" to the queue`,
    );
    client.reply(tags["id"], `Added "${track.name}" to the queue`);
  },
};

export default sr;
