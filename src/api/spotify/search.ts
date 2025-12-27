import { Track } from "@entities";
import type { SpotifySearchResponse, SpotifyErrorResponse } from "./types";

const definitionSearchTracks = {
  name: "searchTracks",
  operation: "query",
  sha256Hash:
    "bc1ca2fcd0ba1013a0fc88e6cc4f190af501851e3dafd3e1ef85840297694428",
  value: null,
};

export async function search(
  query: string,
  limit: number = 1,
): Promise<Track[] | null> {
  const response: SpotifySearchResponse | SpotifyErrorResponse =
    await Spicetify.CosmosAsync.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=${limit}`,
    );

  if (!("tracks" in response)) return null;

  const items = response.tracks.items;
  return items.map((item) => Track.fromSpotifyTrack(item));
}

export async function searchGraphQL(
  query: string,
  limit: number = 1,
): Promise<Track[] | null> {
  const response = await Spicetify.GraphQL.Request(
    // HACK: Definitions.searchTracks may not be initialized
    Spicetify.GraphQL.Definitions.searchTracks ?? definitionSearchTracks,
    {
      searchTerm: query,
      limit: limit,
      includeAudiobooks: false,
      includeAuthors: false,
      includePreReleases: false,
    },
  );

  // TODO: Add typing
  const items: undefined | { item: any; matchedFields: [] }[] =
    response?.data?.searchV2?.tracksV2?.items;

  if (!items?.length) return null;

  return items.map(({ item }) => {
    const data = item.data;
    return new Track(
      data.uri,
      data.name,
      data.artists.items.map((item: any) => item.profile.name),
    );
  });
}

export async function searchTrack(query: string): Promise<Track | null> {
  // NOTE: switched to using GraphQL, as the API kept returning a 429 error
  const result = await searchGraphQL(query);

  if (!result) return null;

  return result[0];
}
