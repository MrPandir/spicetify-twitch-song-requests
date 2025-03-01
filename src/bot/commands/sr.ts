import { Command } from "../types";
import { getUrisFromMessage, urlProcessor } from "../../services/url-handlers";
import { searchTrack, getTrack } from "../../api/spotify";

// TODO: Add a check if the track is already in the queue (optional)

export const sr: Command = {
  permission: "USER",
  async execute({ client, author, args, tags }) {
    if (!args.length) {
      client.reply(tags["id"], "Please provide a track name or URL");
      return;
    }

    // Link processing and adding

    const uris = await getUrisFromMessage(args);

    if (uris.length) {
      console.log("Parsed URIs:", uris);

      Spicetify.addToQueue(uris.map((uri) => ({ uri: uri })));

      if (uris.length === 1) {
        const trackId = Spicetify.URI.from(uris[0])!.id!;
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

      Spicetify.showNotification(
        `${author.displayName} added ${uris.length} tracks to the queue`,
      );
      client.reply(tags["id"], `${uris.length} tracks added to queue`);
      return;
    }

    // Search and add by track name

    const searchQuery = args.join(" ");
    const track = await searchTrack(searchQuery);

    if (!track) {
      console.log(`Track not found with query: "${searchQuery}"`);
      client.reply(tags["id"], "No track found");
      return;
    }

    console.info(`Track found: ${track.name} by ${track.artists[0].name}`);

    Spicetify.addToQueue([{ uri: track.uri }]);

    // TODO: Check for queue limit
    // const queue = Spicetify.Queue;
    // console.log(queue.nextTracks);

    Spicetify.showNotification(
      `${author.displayName} added "${track.name}" to the queue`,
    );
    client.reply(tags["id"], `Added "${track.name}" to the queue`);
  },
};

export default sr;
