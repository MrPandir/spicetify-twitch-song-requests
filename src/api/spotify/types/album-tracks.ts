export interface SpotifyAlbumTracksResponse {
  data: {
    albumUnion: SpotifyAlbumUnion;
  };
}

export interface SpotifyAlbumUnion {
  __typename: "Album";
  playability: SpotifyAlbumPlayability;
  tracksV2: SpotifyAlbumTracksV2;
}

export interface SpotifyAlbumPlayability {
  playable: boolean;
}

export interface SpotifyAlbumTracksV2 {
  items: SpotifyAlbumTrackItem[];
  totalCount: number;
}

export interface SpotifyAlbumTrackItem {
  track: SpotifyAlbumTrack;
  uid: string;
}

export interface SpotifyAlbumTrack {
  artists: SpotifyAlbumTrackArtists;
  associationsV3: SpotifyAlbumTrackAssociationsV3;
  contentRating: SpotifyAlbumTrackContentRating;
  discNumber: number;
  duration: SpotifyAlbumTrackDuration;
  name: string;
  playability: SpotifyAlbumPlayability;
  playcount: string;
  relinkingInformation: unknown | null;
  saved: boolean;
  trackNumber: number;
  uri: string;
}

export interface SpotifyAlbumTrackArtists {
  items: SpotifyAlbumTrackArtistItem[];
}

export interface SpotifyAlbumTrackArtistItem {
  profile: {
    name: string;
  };
  uri: string;
}

export interface SpotifyAlbumTrackAssociationsV3 {
  videoAssociations: {
    totalCount: number;
  };
}

export interface SpotifyAlbumTrackContentRating {
  label: string;
}

export interface SpotifyAlbumTrackDuration {
  totalMilliseconds: number;
}
