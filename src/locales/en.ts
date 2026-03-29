import { User } from "@bot/types";
import { Track } from "@entities/track";
import { LimitInfo } from "@features/limits";

const locale = {
  sr: {
    noArgs: "Please provide a track name or URL",
    trackNotFound: "No track found",
    tracksNotFound: "Could not find tracks",

    addedTrack: (track: Track) => `Added "${track.title}" to the queue`,
    addedTracks: (count: number) => `${count} tracks added to queue`,

    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} added "${track.title}" to the queue`,
    userAddedTracks: (user: User, count: number) =>
      `${user.displayName} added ${count} tracks to the queue`,

    userLimit: (limit: LimitInfo) =>
      `You have reached the limit of ${limit.max} tracks`,
    queueLimit: (limit: LimitInfo) => `Queue is full ${limit.max} tracks`,
  },

  rr: {
    invalidSource: "Provide a Spotify artist, playlist or album link",

    playlistNotFound: "Playlist not found or unavailable",
    albumNotFound: "Album not found or unavailable",
    artistNotFound: "Artist not found or unavailable",

    noAvailableCandidates: "No available tracks to add",

    addedTrack: (track: Track) =>
      `Randomly selected "${track.title}" and added to the queue`,
    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} randomly selected "${track.title}" and added to the queue`,
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

  clear: {
    cleared: "Spotify queue has been cleared",
  },

  volume: {
    current: (volume: number) => `Current volume: ${volume}%`,
    updated: (previousVolume: number, volume: number) =>
      `Volume changed from ${previousVolume}% to ${volume}%`,
  },

  internal: {
    error: "An internal error occurred",
    noArtist: "Internal error: No artist found",
    permissionDenied: "You do not have permission to use this command",
  },
};

export default locale;
