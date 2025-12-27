import { getSongLink, type SongLinkResponse } from "@api/songlink";
import { searchTrack } from "@api/spotify";
import {
  getYouTubeVideoMetadata,
  type YouTubeVideoMetadata,
} from "@api/youtube";
import { Track } from "@entities/track";
import { type HandlerResult, HandlerStatus, type URLHandler } from "../types";

export class YouTubeURLHandler implements URLHandler {
  async process(url: string): Promise<HandlerResult> {
    const songLink = await getSongLink(url);

    if (songLink) {
      return this.processSongLinkData(songLink);
    }

    console.info(
      `Failed to get track URI from songlink for ${url}. Trying to get name from url...`,
    );

    // If you failed to get a link from songlink.
    // This can happen if the rate limit was exceeded.
    // Try to find by title.

    const metadata = await getYouTubeVideoMetadata(url);
    if (!metadata) return { status: HandlerStatus.NOT_MATCHING };

    return await this.processYouTubeVideoData(metadata);
  }

  processSongLinkData(songLink: SongLinkResponse): HandlerResult {
    const uniqueId = songLink.linksByPlatform?.spotify?.entityUniqueId;
    const entity = uniqueId ? songLink.entitiesByUniqueId[uniqueId] : undefined;

    if (!entity) return { status: HandlerStatus.WRONG_CONTENT };

    const uri = Spicetify.URI.from(
      songLink.linksByPlatform?.spotify?.nativeAppUriDesktop,
    );
    const title = entity.title;
    const artists = entity.artistName.split(", ");

    if (!uri || !Spicetify.URI.isTrack(uri) || !title || !artists) {
      console.error("Failed parsing response from songlink", songLink);
      return { status: HandlerStatus.WRONG_CONTENT };
    }

    const track = new Track(uri, title, artists);
    return { status: HandlerStatus.SUCCESS, track: track };
  }

  async processYouTubeVideoData(
    metadata: YouTubeVideoMetadata,
  ): Promise<HandlerResult> {
    const track = await searchTrack(metadata.title);
    if (!track) return { status: HandlerStatus.NOT_MATCHING };

    return { status: HandlerStatus.SUCCESS, track: track };
  }
}
