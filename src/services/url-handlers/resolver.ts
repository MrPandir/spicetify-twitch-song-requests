import { Track } from "@entities/track";
import { urlProcessor } from ".";

export async function getTracksFromLinks(
  links: string[],
): Promise<{ tracks: Track[]; detected: boolean; length: number }> {
  const tracks = await Promise.all(
    links.map((link) => urlProcessor.processURL(link)),
  );

  const detectedTracks = tracks.filter((track) => track !== undefined);
  const noNullTracks = detectedTracks.filter((track) => track !== null);

  return {
    tracks: noNullTracks,
    detected: detectedTracks.length > 0,
    length: detectedTracks.length,
  };
}
