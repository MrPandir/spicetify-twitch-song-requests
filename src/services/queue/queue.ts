import { Track } from "@entities/track";
import { DataUpdateQueue, QueueTrack, UserId } from "./types";

// TODO: Implement queue limits (per user, per queue)
// TODO: Disable repeats (optional, per user, per queue)
// TODO: Add uid accounting so as not to delete all tracks from the queue, but only one from the user
// TODO: Implement deletion by uri

export class Queue {
  private tracks: QueueTrack[];

  constructor(tracks: QueueTrack[] = []) {
    this.tracks = tracks;
  }

  addTracks(userId: UserId, tracks: Track[]): Track[] {
    console.log("Adding tracks to queue:", tracks, "Queue:", this.tracks);

    // TODO: Check the availability of a track to add

    this.tracks.push(...tracks.map((track) => new QueueTrack(track, userId)));

    const tracksUris = tracks.map((track) => track.toContextTrack());
    Spicetify.addToQueue(tracksUris);

    return tracks;
  }

  addTrack(userId: UserId, track: Track): Track {
    return this.addTracks(userId, [track])[0];
  }

  getTracksByUser(userId: UserId): Track[] {
    return this.tracks.filter((track) => track.requestedBy === userId);
  }

  clearTracksByUser(userId: UserId): Track[] {
    throw new Error("Method not implemented.");
  }

  private findTrackIndexFromUserEndIndex(
    userId: UserId,
    endIndexForUser: number,
  ): number | null {
    if (endIndexForUser <= 0) return null;

    let count = 0;
    for (let i = this.tracks.length - 1; i >= 0; i--) {
      if (this.tracks[i].requestedBy === userId) count++;
      if (count === endIndexForUser) return i;
    }
    return null;
  }

  private removeTrackByIndexFromEnd(
    userId: UserId,
    endIndex: number = 1,
  ): Track | null {
    endIndex = Math.abs(endIndex);
    const isNumber = endIndex - endIndex === 0; // Check NaN and Infinity
    if (endIndex === 0 || !isNumber) endIndex = 1;

    const userTracks = this.getTracksByUser(userId);
    if (endIndex > userTracks.length) return null;

    const index = this.findTrackIndexFromUserEndIndex(userId, endIndex);
    if (index === null) return null;

    const [deletedTrack] = this.tracks.splice(index, 1);
    if (!deletedTrack) return null;

    Spicetify.removeFromQueue([deletedTrack.toContextTrack()]);
    return deletedTrack;
  }

  private removeTrackBySearchQuery(
    userId: UserId,
    searchQuery: string,
    global: boolean = false,
  ): Track | null {
    const query = searchQuery.toLowerCase();

    for (let i = this.tracks.length - 1; i >= 0; i--) {
      if (!global && this.tracks[i].requestedBy !== userId) continue;

      const track = this.tracks[i];
      const title = track.title.toLowerCase();
      const artists = track.getArtists().toLowerCase();

      if (title.includes(query) || artists.includes(query)) {
        const [removedTrack] = this.tracks.splice(i, 1);
        if (!removedTrack) return null;

        Spicetify.removeFromQueue([removedTrack.toContextTrack()]);
        return removedTrack;
      }
    }

    return null;
  }

  removeTrack(userId: UserId, endIndex: number): Track | null;
  removeTrack(userId: UserId, searchQuery: string): Track | null;
  removeTrack(
    userId: UserId,
    searchQuery: string,
    global: boolean,
  ): Track | null;

  removeTrack(
    userId: UserId,
    indexOrSearchQuery: number | string,
    global: boolean = false,
  ): Track | null {
    if (typeof indexOrSearchQuery === "number") {
      return this.removeTrackByIndexFromEnd(userId, indexOrSearchQuery);
    }

    if (typeof indexOrSearchQuery !== "string")
      throw new Error(`Invalid indexOrSearchQuery: ${indexOrSearchQuery}`);

    // First try to delete the track from the user
    let track = this.removeTrackBySearchQuery(userId, indexOrSearchQuery);
    if (track) return track;

    if (global === false) return null;

    // Delete track in all users queue
    track = this.removeTrackBySearchQuery(userId, indexOrSearchQuery, true);
    return track;
  }

  updateHandler = ({ type, data }: DataUpdateQueue): void => {
    if (type !== "queue_update") {
      throw new Error("Invalid data update queue");
    }

    const queueUris = data.queued.map((track) => track.uri);

    for (let i = this.tracks.length - 1; i >= 0; i--) {
      const uri = this.tracks[i].uri.toString();

      if (!queueUris.includes(uri)) {
        this.tracks.splice(i, 1);
      } else {
        queueUris.splice(queueUris.indexOf(uri), 1);
      }
    }

    if (queueUris.length === 0) return;

    // Add remaining tracks to "spotify" user
    const tracksToAdd = data.queued
      .filter((track) => queueUris.includes(track.uri))
      .map((raw_track) => {
        const track = Track.fromSpotifyTrack(raw_track);
        return new QueueTrack(track, "spotify");
      });

    if (tracksToAdd.length === 0) return;

    this.tracks.push(...tracksToAdd);
  };
}
