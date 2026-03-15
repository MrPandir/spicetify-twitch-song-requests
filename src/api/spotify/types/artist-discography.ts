export interface SpotifyArtistDiscographyAllResponse {
  data: {
    artistUnion: SpotifyArtistUnion;
  };
}

export interface SpotifyArtistUnion {
  __typename: "Artist";
  discography: { all: SpotifyArtistDiscographyAll };
}

export interface SpotifyArtistDiscographyAll {
  items: SpotifyArtistDiscographyAllItem[];
  totalCount: number;
}

export interface SpotifyArtistDiscographyAllItem {
  releases: SpotifyArtistDiscographyReleases;
}

export interface SpotifyArtistDiscographyReleases {
  items: SpotifyArtistDiscographyRelease[];
}

export interface SpotifyArtistDiscographyRelease {
  coverArt: SpotifyCoverArt;
  date: SpotifyReleaseDate;
  id: string;
  name: string;
  playability: SpotifyReleasePlayability;
  sharingInfo: SpotifySharingInfo;
  tracks: { totalCount: number };
  type: string;
  uri: string;
}

export interface SpotifyCoverArt {
  sources: SpotifyCoverArtSource[];
}

export interface SpotifyCoverArtSource {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyReleaseDate {
  isoString: string;
  precision: string;
  year: number;
}

export interface SpotifyReleasePlayability {
  playable: boolean;
  reason: string;
}

export interface SpotifySharingInfo {
  shareId: string;
  shareUrl: string;
}
