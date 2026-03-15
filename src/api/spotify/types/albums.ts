import type { SpotifySimpleArtist } from "./artists";

export interface SimpleSpotifyImage {
  url: string;
  label: string;
}

export interface SimpleSpotifyAlbum {
  type: "album";
  uri: string;
  name: string;
  artist: SpotifySimpleArtist;
  images: SimpleSpotifyImage[];
}
