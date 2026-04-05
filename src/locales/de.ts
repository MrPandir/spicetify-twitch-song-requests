import { User } from "@bot/types";
import { Track } from "@entities/track";
import { LocaleDefinition } from "@locales";
import { LimitInfo } from "@features/limits";

const locale: LocaleDefinition = {
  sr: {
    noArgs: "Bitte gib einen Tracknamen oder eine URL an",
    trackNotFound: "Kein Track gefunden",
    tracksNotFound: "Keine Tracks gefunden",

    addedTrack: (track: Track) =>
      `"${track.title}" wurde zur Warteschlange hinzugefugt`,
    addedTracks: (count: number) =>
      `${count} Tracks wurden zur Warteschlange hinzugefugt`,

    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} hat "${track.title}" zur Warteschlange hinzugefugt`,
    userAddedTracks: (user: User, count: number) =>
      `${user.displayName} hat ${count} Tracks zur Warteschlange hinzugefugt`,

    userLimit: (limit: LimitInfo) =>
      `Du hast das Limit von ${limit.max} Tracks erreicht`,
    queueLimit: (limit: LimitInfo) =>
      `Die Warteschlange ist voll: ${limit.max} Tracks`,
  },

  rr: {
    invalidSource:
      "Gib einen Spotify-Link zu einem Kunstler, einer Wiedergabeliste oder einem Album an",

    playlistNotFound: "Wiedergabeliste nicht gefunden oder nicht verfugbar",
    albumNotFound: "Album nicht gefunden oder nicht verfugbar",
    artistNotFound: "Kunstler nicht gefunden oder nicht verfugbar",

    noAvailableCandidates: "Es gibt keine passenden Tracks zum Hinzufugen",

    addedTrack: (track: Track) =>
      `"${track.title}" wurde zufallig ausgewahlt und zur Warteschlange hinzugefugt`,
    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} hat "${track.title}" zufallig ausgewahlt und zur Warteschlange hinzugefugt`,
  },

  song: {
    noSongPlaying: "Gerade laeuft kein Track",
    failedToGet: "Der aktuelle Track konnte nicht abgerufen werden",

    nowPlaying: (name: string, artists: string) => `"${name}" von ${artists}`,
  },

  rm: {
    emptyQueue: "Deine Warteschlange ist leer",
    trackNotFound: "Track nicht gefunden",

    trackDeleted: (track: Track) => `Track "${track.title}" wurde entfernt`,
  },

  clear: {
    cleared: "Die Spotify-Warteschlange wurde geleert",
  },

  prev: {
    success: "Zum vorherigen Track gewechselt",
    notPlayingTrack: "Gerade laeuft kein Track",
    noPrevTrack: "Es gibt keinen vorherigen Track",
  },

  next: {
    success: "Zum nachsten Track gewechselt",
    notPlayingTrack: "Gerade laeuft kein Track",
    noNextTrack: "Es gibt keinen nachsten Track",
  },

  volume: {
    current: (volume: number) => `Aktuelle Lautstarke: ${volume}%`,
    updated: (previousVolume: number, volume: number) =>
      `Lautstarke von ${previousVolume}% auf ${volume}% geandert`,
  },

  internal: {
    error: "Es ist ein interner Fehler aufgetreten",
    noArtist: "Interner Fehler: Kein Kunstler gefunden",
    permissionDenied: "Du darfst diesen Befehl nicht verwenden",
  },
};

export default locale;
