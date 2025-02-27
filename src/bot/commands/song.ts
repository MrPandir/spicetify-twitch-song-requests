import { Command } from "../types";

export const song: Command = {
  permission: "USER",
  async execute({ client, author, args, tags }) {
    const songName = Spicetify.Player.data.item.name;
    const songArtist = Spicetify.Player.data.item.artists
      ?.map((artist) => artist.name)
      .join(", ");

    if (!songName) {
      console.error("Failed to get current track", Spicetify.Player.data);
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
