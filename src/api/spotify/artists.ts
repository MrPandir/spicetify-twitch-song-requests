import type {
  SpotifyArtistDiscographyAllResponse,
  SpotifyArtistDiscographyAll,
} from "./types/artist-discography";

export async function getArtistDiscographyAll(
  artistUri: Spicetify.URI,
  limit: number = 1000,
  offset: number = 0,
): Promise<SpotifyArtistDiscographyAll> {
  const response: SpotifyArtistDiscographyAllResponse =
    await Spicetify.GraphQL.Request(
      Spicetify.GraphQL.Definitions.queryArtistDiscographyAll,
      {
        uri: artistUri.toString(),
        offset: offset,
        limit: limit,
      },
    );

  return response?.data?.artistUnion.discography.all;
}
