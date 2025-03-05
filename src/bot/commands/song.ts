import { Command } from "../types";

export const song: Command = {
  permission: "USER",
  async execute({ client, author, args, tags }) {
    const data = Spicetify.Player.data;
    if (!data) {
      client.reply(tags["id"], "No song is currently playing");
      return;
    }

    const songName = data.item.name;
    const songArtist = data.item.artists
      ?.map((artist) => artist.name)
      .join(", ");

    if (!songName) {
      console.error("Failed to get current track", Spicetify.Player.data);
      client.reply(tags["id"], "Failed to get current track");
      return;
    }

    if (songArtist) {
      client.reply(tags["id"], `"${songName}" by ${songArtist}`);
    } else {
      client.reply(tags["id"], `${songName}`);
    }
  },
};

export default song;
