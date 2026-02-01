import { getSongLink, type SongLinkResponse } from "@api/songlink";
import { Track } from "@entities/track";
import { hasMatchingDomain } from "@utils/music-services";
import { HandlerStatus, type HandlerResult, type URLHandler } from "../types";
import { YouTubeURLHandler } from "./youtube";

export class SongLinkURLHandler implements URLHandler {
  youtubeDomains = YouTubeURLHandler.supportedDomains;

  async process(url: string): Promise<HandlerResult> {
    const isSupportedService = hasMatchingDomain(url);

    if (!isSupportedService) {
      console.warn(
        `[SongLinkURLHandler] Unsupported service link skipped: ${url}`,
      );
      return { status: HandlerStatus.NOT_MATCHING };
    }

    const songLink = await getSongLink(url);

    if (songLink) {
      return this.processSongLinkData(songLink);
    }

    console.warn(
      `[SongLinkURLHandler] SongLink API returned no data for: ${url}`,
    );

    // HACK: Skip to the next YouTube handler
    if (hasMatchingDomain(url, this.youtubeDomains)) {
      console.debug(
        `[SongLinkURLHandler] YouTube link detected → skipping to next handler: ${url}`,
      );
      return { status: HandlerStatus.NOT_MATCHING };
    }

    return { status: HandlerStatus.WRONG_CONTENT };
  }

  processSongLinkData(songLink: SongLinkResponse): HandlerResult {
    const uniqueId = songLink.linksByPlatform?.spotify?.entityUniqueId;
    const entity = uniqueId ? songLink.entitiesByUniqueId[uniqueId] : undefined;

    if (!entity) {
      console.log(
        `[SongLinkURLHandler] No Spotify entity found in SongLink response for URL: ${songLink}`,
      );
      return { status: HandlerStatus.WRONG_CONTENT };
    }

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
}
