import { Track } from "@entities";
import type { TwitchUserId } from "@entities";
import { DataUpdateQueue, QueueTrack } from "./types";

// TODO: Disable repeats (optional, per user, per queue)
// TODO: Add uid accounting so as not to delete all tracks from the queue, but only one from the user
// TODO: Implement deletion by uri
// TODO: Implement get current track

export class Queue {
  private tracks: QueueTrack[];

  constructor(tracks: QueueTrack[] = []) {
    this.tracks = tracks;
  }

  async addTracks(
    userId: TwitchUserId,
    tracks: Track[],
    atFront: boolean = false,
  ): Promise<Track[]> {
    // prettier-ignore
    console.log([
      `Adding ${tracks.length} track(s) from ${userId} → ${atFront ? "to front" : "to end"}`,
      `Queue before: ${this.tracks.length}`,
    ].join("\n"));

    // TODO: Check the availability of a track to add

    this.tracks.push(...tracks.map((track) => new QueueTrack(track, userId)));

    const tracksUris = tracks.map((track) => track.toContextTrack());

    if (atFront) {
      await this.addTracksToFront(tracksUris);
    } else {
      await Spicetify.addToQueue(tracksUris);
    }

    return tracks;
  }

  async addTrack(
    userId: TwitchUserId,
    track: Track,
    atFront: boolean = false,
  ): Promise<Track> {
    const addedTracks = await this.addTracks(userId, [track], atFront);
    return addedTracks[0];
  }

  private async addTracksToFront(contextTracks: Spicetify.ContextTrack[]) {
    const queue = await Spicetify.Platform.PlayerAPI.getQueue();

    if (!queue.queued.length) return await Spicetify.addToQueue(contextTracks);

    await Spicetify.Platform.PlayerAPI.insertIntoQueue(contextTracks, {
      before: {
        uri: queue.queued[0].uri,
        uid: queue.queued[0].uid,
      },
    });
  }

  getTracksByUser(userId: TwitchUserId): Track[] {
    return this.tracks.filter((track) => track.requestedBy === userId);
  }

  getAllTracks(): QueueTrack[] {
    return this.tracks;
  }

  hasTrack(trackUri: Spicetify.URI | string): boolean {
    const uri = Spicetify.URI.from(trackUri);
    if (!uri) throw new Error(`Invalid URI: ${trackUri}`);

    return this.tracks.some((track) =>
      Spicetify.URI.isSameIdentity(track.uri, uri),
    );
  }

  async clearAllTracks(): Promise<void> {
    await Spicetify.Platform.PlayerAPI.clearQueue();
    this.tracks = [];
  }

  clearTracksByUser(userId: TwitchUserId): Track[] {
    throw new Error("Method not implemented.");
  }

  private findTrackIndexFromUserEndIndex(
    userId: TwitchUserId,
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
    userId: TwitchUserId,
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
    userId: TwitchUserId,
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

  removeTrack(userId: TwitchUserId, endIndex: number): Track | null;
  removeTrack(userId: TwitchUserId, searchQuery: string): Track | null;
  removeTrack(
    userId: TwitchUserId,
    searchQuery: string,
    global: boolean,
  ): Track | null;

  removeTrack(
    userId: TwitchUserId,
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
