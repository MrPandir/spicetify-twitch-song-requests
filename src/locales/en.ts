import { User } from "@bot/types";
import { Track } from "@entities/track";
import { LimitInfo } from "@services/limits";

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

  srn: {
    noPermission:
      "Command available only to the broadcaster, moderators and subscribers",
  },

  rr: {
    // TODO: Написать что source не коректный
    invalidSource:
      "Provide a Spotify artist, playlist or album link",

    playlistNotFound: "Playlist not found or unavailable",
    albumNotFound: "Album not found or unavailable",
    artistNotFound: "Artist not found or unavailable",

    noAvailableCandidates: "No available tracks to add",

    addedTrack: (track: Track) =>
      `Randomly selected "${track.title}" and added to the queue`,
    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} randomly selected "${track.title}" and added to the queue`,
  },

  rrn: {
    noPermission:
      "Command available only to the broadcaster, moderators and subscribers",
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
    permissionDenied: "Only broadcaster and moderators can use this command",
    cleared: "Spotify queue has been cleared",
  },

  internal: {
    error: "An internal error occurred",
    noArtist: "Internal error: No artist found",
  },
};

export default locale;
