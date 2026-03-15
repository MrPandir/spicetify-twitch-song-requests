import type {
  SpotifyAlbumTracksResponse,
  SpotifyAlbumUnion,
} from "./types/album-tracks";

export async function getAlbumTracks(
  albumUri: Spicetify.URI,
  limit: number = 300,
  offset: number = 0,
): Promise<SpotifyAlbumUnion> {
  const response: SpotifyAlbumTracksResponse = await Spicetify.GraphQL.Request(
    Spicetify.GraphQL.Definitions.queryAlbumTracks,
    {
      uri: albumUri.toString(),
      offset: offset,
      limit: limit,
    },
  );

  return response?.data?.albumUnion;
}
