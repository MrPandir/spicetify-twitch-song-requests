import type { SpotifyResponse, Track } from "./types";

export async function search(
  query: string,
  limit: number = 1,
): Promise<SpotifyResponse> {
  return Spicetify.CosmosAsync.get(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=${limit}`,
  );
}

export async function getTrack(query: string): Promise<Track | null> {
  const result = await search(query);

  if (!("tracks" in result)) {
    console.error(
      `Failed to fetch track: ${result.code} ${result.message} with query "${query}"`,
    );
    return null;
  }

  return result.tracks?.items?.[0];
}
