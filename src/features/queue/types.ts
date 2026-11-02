import { Track } from "@entities";
import type { TwitchUserId } from "@entities";

export interface QueueRequester {
  id: TwitchUserId;
  userName: string;
  displayName: string;
}

export class QueueTrack extends Track {
  requester: QueueRequester | null;
  uid?: string;

  constructor(track: Track, requester: QueueRequester | null, uid?: string) {
    super(track.uri, track.title, track.artists_names);
    this.requester = requester;
    this.uid = uid;
  }
}

export interface DataUpdateQueue {
  data: {
    current: DataUpdateTrack | null;
    nextUp: DataUpdateTrack[];
    queued: DataUpdateTrack[];
  };
  defaultPrevented: boolean;
  immediateStopped: boolean;
  stopped: boolean;
  type: "queue_update";
}

export interface DataUpdateTrack {
  type: "track";
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
