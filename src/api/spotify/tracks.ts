import type { SpotifyTrack, SpotifyErrorResponse } from "./types";

// TODO: Add ?market=from_token and check is_playable

export async function getTrack(
  trackId: string,
): Promise<SpotifyTrack | SpotifyErrorResponse> {
  return Spicetify.CosmosAsync.get(
    `https://api.spotify.com/v1/tracks/${trackId}`,
  );
}
