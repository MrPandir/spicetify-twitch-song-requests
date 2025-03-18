import { User } from "@bot/types";
import { Track } from "@entities/track";

const locale = {
  sr: {
    noArgs: "Please provide a track name or URL",
    trackNotFound: "No track found",
    notTracks: "These are not tracks",

    addedTrack: (track: Track) => `Added "${track.title}" to the queue`,
    addedTracks: (count: number) => `${count} tracks added to queue`,

    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} added "${track.title}" to the queue`,
    userAddedTracks: (user: User, count: number) =>
      `${user.displayName} added ${count} tracks to the queue`,
  },

  song: {
    noSongPlaying: "No song is currently playing",
    failedToGet: "Failed to get current track",

    nowPlaying: (name: string, artists: string) => `"${name}" by ${artists}`,
  },

  rm: {
    emptyQueue: "Your queue is empty",
    trackNotFound: "Track not found",

    trackDeleted: (track: Track) => `Track "${track.title}" deleted`,
  },

  internal: {
    error: "An internal error occurred",
    noArtist: "Internal error: No artist found",
  },
};

export default locale;
