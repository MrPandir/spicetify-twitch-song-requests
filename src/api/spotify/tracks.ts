import type { SpotifyTrack, SpotifyErrorResponse } from "./types";

// TODO: Add ?market=from_token and check is_playable

async function _getTrack(
  trackId: string,
): Promise<SpotifyTrack | SpotifyErrorResponse> {
  return Spicetify.CosmosAsync.get(
    `https://api.spotify.com/v1/tracks/${trackId}`,
  );
}

export async function getTrack(trackId: string): Promise<SpotifyTrack | null> {
  const response = await _getTrack(trackId);
  if (!("uri" in response)) return null;
  return response;
}
