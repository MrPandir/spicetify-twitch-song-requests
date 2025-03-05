import { type URLHandler, type HandlerResult, HandlerStatus } from "../types";
import { getYouTubeVideoMetadata } from "@api/youtube";
import { searchTrack } from "@api/spotify";
import { getSongLink } from "@api/songlink";
import { validateSpotifyUri } from "../uri-validator";

export class YouTubeURLHandler implements URLHandler {
  async process(url: string): Promise<HandlerResult> {
    const songLink = await getSongLink(url);

    if (songLink) {
      const uri = Spicetify.URI.from(
        songLink.linksByPlatform?.spotify?.nativeAppUriDesktop,
      );

      if (!uri) {
        return { uri: null, status: HandlerStatus.WRONG_CONTENT };
      }

      return validateSpotifyUri(uri);
    }

    console.log(
      `Failed to get track URI from songlink ${songLink} for ${url}. Trying to find by name...`,
    );

    // If you failed to get a link from songlink.
    // This can happen if the rate limit was exceeded.
    // Try to find by title.

    const metadata = await getYouTubeVideoMetadata(url);
    if (!metadata) return { uri: null, status: HandlerStatus.NOT_MATCHING };

    const spotifyTrack = await searchTrack(metadata.title);
    if (!spotifyTrack) return { uri: null, status: HandlerStatus.NOT_MATCHING };

    const uri = Spicetify.URI.from(spotifyTrack.uri);

    if (!uri) {
      console.log(
        `Failed to get track URI from spotify track ${spotifyTrack} for ${url}.`,
      );
    }

    return validateSpotifyUri(uri);
  }
}
