import { SpotifyResponse } from "./types";

export async function search(
  query: string,
  limit: number = 1,
): Promise<SpotifyResponse> {
  return Spicetify.CosmosAsync.get(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=${limit}`,
    undefined,
    {
      mode: "no-cors",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  );
}
