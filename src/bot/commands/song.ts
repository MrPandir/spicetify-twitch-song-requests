import { reply } from "@bot";
import { CommandExecutor } from "../types";

const executor: CommandExecutor = async function (client, author, args, tags) {
  const data = Spicetify.Player.data;
  if (!data) {
    return reply("song", "noSongPlaying");
  }

  const songName = data.item.name;
  const songArtists = data.item.artists
    ?.map((artist) => artist.name)
    .join(", ");

  if (!songName) {
    console.error("Failed to get current track", Spicetify.Player.data);
    return reply("song", "failedToGet");
  }

  if (songArtists) {
    return reply("song", "nowPlaying", songName, songArtists);
  }

  return reply("internal", "noArtist");
};

export default executor;
