import { Track } from "@entities/track";

export type UserId = string;

export class QueueTrack extends Track {
  requestedBy: UserId;
  uid?: string;

  constructor(track: Track, requestedBy: UserId, uid?: string) {
    super(track.uri, track.title, track.artists_names);
    this.requestedBy = requestedBy;
    this.uid = uid;
  }
}

export interface DataUpdateQueue {
  data: {
    nextUp: DataUpdateTrack[];
    queued: DataUpdateTrack[];
  };
  defaultPrevented: boolean;
  immediateStopped: boolean;
  stopped: boolean;
  type: "queue_update";
}

export interface DataUpdateTrack {
  uri: string;
  uid?: string;
  name: string;
  artists: DataUpdateArtist[];
  provider: "context" | "queue";
}

export interface DataUpdateArtist {
  type: "artist";
  uri: string;
  name: string;
}
