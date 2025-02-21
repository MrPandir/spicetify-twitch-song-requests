import type { URLHandler, URI } from "./types";
import { getYouTubeVideoMetadata } from "../../api/youtube";
import { getTrack } from "../../api/spotify/search";

export class YouTubeURLHandler implements URLHandler {
  async process(url: string): Promise<URI | null> {
    const metadata = await getYouTubeVideoMetadata(url);
    if (!metadata) return null;

    const spotifyTrack = await getTrack(metadata.title);
    if (!spotifyTrack) return null;

    return spotifyTrack.uri;
  }
}
