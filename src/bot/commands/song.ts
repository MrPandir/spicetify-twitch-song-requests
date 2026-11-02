import { reply } from "@bot";
import { queue } from "@features/queue";
import { CommandExecutor } from "../types";

const executor: CommandExecutor = async function () {
  const currentTrack = queue.getCurrentTrack();

  if (!currentTrack) {
    return reply("song", "noSongPlaying");
  }

  return reply(
    "song",
    "nowPlaying",
    currentTrack.title,
    currentTrack.getArtists(),
    currentTrack.requester,
  );
};

export default executor;
