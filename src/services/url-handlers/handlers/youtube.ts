import { searchTrack } from "@api/spotify";
import {
  getYouTubeVideoMetadata,
  type YouTubeVideoMetadata,
} from "@api/youtube";
import { hasMatchingDomain } from "@utils/music-services";
import { HandlerStatus, type HandlerResult, type URLHandler } from "../types";

export class YouTubeURLHandler implements URLHandler {
  static supportedDomains: string[] = [
    "youtube.com",
    "youtu.be",
    "music.youtube.com",
    "m.youtube.com",
  ];

  async process(url: string): Promise<HandlerResult> {
    const isSupportedService = hasMatchingDomain(
      url,
      YouTubeURLHandler.supportedDomains,
    );

    if (!isSupportedService) {
      return { status: HandlerStatus.NOT_MATCHING };
    }

    const metadata = await getYouTubeVideoMetadata(url);
    if (!metadata) return { status: HandlerStatus.NOT_MATCHING };

    return await this.processYouTubeVideoData(metadata);
  }

  async processYouTubeVideoData(
    metadata: YouTubeVideoMetadata,
  ): Promise<HandlerResult> {
    const track = await searchTrack(metadata.title);

    if (!track) return { status: HandlerStatus.NOT_MATCHING };

    return { status: HandlerStatus.SUCCESS, track: track };
  }
}
