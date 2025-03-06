import { getTrack } from "@api/spotify";
import { Track } from "@entities/track";
import { urlProcessor } from ".";
import type { SuccessHandlerResult } from "./types";

export async function getTracksFromLinks(
  links: string[],
): Promise<{ tracks: Track[]; detected: boolean; length: number }> {
  const results = await Promise.all(
    links.map((link) => urlProcessor.processURL(link)),
  );

  const noNullResults = results.filter((result) => result !== null);

  const tracks = await Promise.all(noNullResults.map(convertResultToTrack));

  return {
    tracks: tracks,
    detected: noNullResults.length > 0,
    length: noNullResults.length,
  };
}

async function convertResultToTrack(
  result: SuccessHandlerResult,
): Promise<Track> {
  if (result.metadata) {
    return new Track(
      result.uri,
      result.metadata.title,
      result.metadata.artists,
    );
  }

  const spotifyTrack = await getTrack(result.uri.id!);
  if (!spotifyTrack || "code" in spotifyTrack) {
    throw new Error(`Failed to fetch track for URI: ${result.uri}`);
  }

  return Track.fromSpotifyTrack(spotifyTrack);
}
