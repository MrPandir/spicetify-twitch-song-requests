import { Command } from "../types";
import { search } from "../../api/spotify/search";

// TODO: Add a check if the track is already in the queue (optional)

export const sr: Command = {
  permission: "USER",
  async execute({ client, author, args, tags }) {
    if (!args.length) {
      client.replay(tags["id"], "Please provide a track name or URL");
      return;
    }

    const searchQuery = args.join(" ");
    search(searchQuery).then((result) => {
      const track = (result as SpotifySearchResponse).tracks?.items?.[0];

      if (!track) {
        client.replay(tags["id"], "No track found");
        return;
      }

      console.info(`Track found: ${track.name} by ${track.artists[0].name}`);

      Spicetify.addToQueue([{ uri: track.uri }]);
      Spicetify.showNotification(
        `${author.displayName} added "${track.name}" to the queue`,
      );
    });
  },
};
