import type { Track, SpotifyErrorResponse } from "./types";

export async function getTrack(
  trackId: string,
): Promise<Track | SpotifyErrorResponse> {
  return Spicetify.CosmosAsync.get(
    `https://api.spotify.com/v1/tracks/${trackId}`,
  );
}
