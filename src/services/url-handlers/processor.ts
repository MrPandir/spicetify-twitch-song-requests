import { Track } from "@entities/track";
import { HandlerStatus, type URLHandler } from "./types";

export class URLProcessor {
  private handlers: URLHandler[] = [];

  registerHandler(handler: URLHandler) {
    this.handlers.push(handler);
  }

  async processURL(url: string): Promise<Track | null | undefined> {
    for (const handler of this.handlers) {
      const result = await handler.process(url);

      // Check if handler succeeded and has a valid URI
      if (result.status === HandlerStatus.SUCCESS) {
        return result.track;
      }

      // URL pattern doesn't match, try next handler
      if (result.status === HandlerStatus.NOT_MATCHING) {
        continue;
      }

      // Content type is invalid, stop processing
      if (result.status === HandlerStatus.WRONG_CONTENT) {
        return null;
      }
    }

    return undefined;
  }

  async getTracksFromLinks(
    urls: string[],
  ): Promise<{ tracks: Track[]; detected: boolean; length: number }> {
    const tracks = await Promise.all(urls.map((url) => this.processURL(url)));

    const detectedTracks = tracks.filter((track) => !!track);

    return {
      tracks: detectedTracks,
      length: detectedTracks.length,
      detected: detectedTracks.length > 0,
    };
  }
}
