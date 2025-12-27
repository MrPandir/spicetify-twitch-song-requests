import { Track } from "@entities";
import type { SpotifyTrack, SpotifyErrorResponse } from "./types";

const definitionGetTrack = {
  name: "getTrack",
  operation: "query",
  sha256Hash:
    "612585ae06ba435ad26369870deaae23b5c8800a256cd8a57e08eddc25a37294",
  value: null,
};

// TODO: Add ?market=from_token and check is_playable

async function _getTrack(
  trackId: string,
): Promise<SpotifyTrack | SpotifyErrorResponse> {
  return Spicetify.CosmosAsync.get(
    `https://api.spotify.com/v1/tracks/${trackId}`,
  );
  // if (!("uri" in response)) return null;
  // return response;
}

async function _getTrackGraphQL(uri: string): Promise<Track | null> {
  const response = await Spicetify.GraphQL.Request(
    // HACK: Definitions.getTrack may not be initialized
    Spicetify.GraphQL.Definitions.getTrack ?? definitionGetTrack,
    { uri: uri },
  );

  const data = response.data.trackUnion;

  if (!("uri" in data)) return null;

  const dataArtists: [any] = data.firstArtist.items.concat(
    data.otherArtists.items,
  );
  const artists = dataArtists.map((artist) => artist.profile.name);

  return new Track(data.uri, data.name, artists);
}

export async function getTrack(uri: Spicetify.URI): Promise<Track | null> {
  return _getTrackGraphQL(uri.toString());
}
