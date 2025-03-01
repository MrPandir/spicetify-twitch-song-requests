import type { URLHandler, URI } from "../types";
import { getYouTubeVideoMetadata } from "../../../api/youtube";
import { searchTrack } from "../../../api/spotify";
import { getSongLink } from "../../../api/songlink";

export class YouTubeURLHandler implements URLHandler {
  async process(url: string): Promise<URI | null> {
    const songLink = await getSongLink(url);

    if (songLink) {
      return songLink.linksByPlatform.spotify.nativeAppUriDesktop;
    }

    // If you failed to get a link from songlink.
    // This can happen if the rate limit was exceeded.
    // Try to find by title.

    const metadata = await getYouTubeVideoMetadata(url);
    if (!metadata) return null;

    const spotifyTrack = await searchTrack(metadata.title);
    if (!spotifyTrack) return null;

    return spotifyTrack.uri;
  }
}
