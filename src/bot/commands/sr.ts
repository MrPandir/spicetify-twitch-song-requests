import { Command } from "../types";
import { urlProcessor } from "../../services/url-handlers";
import { getTrack } from "../../api/spotify/search";

// TODO: Add a check if the track is already in the queue (optional)

export const sr: Command = {
  permission: "USER",
  async execute({ client, author, args, tags }) {
    if (!args.length) {
      client.replay(tags["id"], "Please provide a track name or URL");
      return;
    }

    // Link processing and adding

    const firstUri = await urlProcessor.processURL(args[0]);

    if (firstUri) {
      const uris: Spicetify.ContextTrack[] = [{ uri: firstUri }];
      for (let i = 1; i < args.length; i++) {
        const uri = await urlProcessor.processURL(args[i]);
        if (uri !== null) uris.push({ uri: uri });
      }

      console.log(`Parsed URIs: ${uris.map((uri) => uri.uri).join(", ")}`);

      Spicetify.addToQueue(uris);

      if (uris.length === 1) {
        // TODO: get track name
        Spicetify.showNotification(
          `${author.displayName} added ${uris.length} track to the queue`,
        );
        client.replay(tags["id"], `${uris.length} track added to queue`);
      } else {
        Spicetify.showNotification(
          `${author.displayName} added ${uris.length} tracks to the queue`,
        );
        client.replay(tags["id"], `${uris.length} tracks added to queue`);
      }
      return;
    }

    // Search and add by track name

    const searchQuery = args.join(" ");
    const track = await getTrack(searchQuery);

    if (!track) {
      client.replay(tags["id"], "No track found");
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
    client.replay(tags["id"], `Added "${track.name}" to the queue`);
  },
};

export default sr;
