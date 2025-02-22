import type { URLHandler, URI } from "./types";
import { getYouTubeVideoMetadata } from "../../api/youtube";
import { searchTrack } from "../../api/spotify/search";

export class YouTubeURLHandler implements URLHandler {
  async process(url: string): Promise<URI | null> {
    const metadata = await getYouTubeVideoMetadata(url);
    if (!metadata) return null;

    const spotifyTrack = await searchTrack(metadata.title);
    if (!spotifyTrack) return null;

    return spotifyTrack.uri;
  }
}
