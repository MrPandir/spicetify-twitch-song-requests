import type { SpotifySimpleArtist } from "./types/artists";

export interface FavoriteTrackItem {
  type: "track";
  uri: string;
  name: string;
  artists: SpotifySimpleArtist[];
  isPlayable: boolean;
}

export interface FavoriteTracksResponse {
  items: FavoriteTrackItem[];
  offset: number;
  limit: number;
  totalLength: number;
  unfilteredTotalLength: number;
}

export async function getFavoriteTracks(
  offset: number = 0,
  limit?: number,
): Promise<FavoriteTracksResponse> {
  return Spicetify.Platform.LibraryAPI.getTracks({
    offset: offset,
    limit: limit,
  });
}
