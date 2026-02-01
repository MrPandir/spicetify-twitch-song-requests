import { getTrack } from "@api/spotify";
import { addHttpsPrefix } from "@utils";
import { HandlerStatus } from "../types";
import type { HandlerResult, URLHandler } from "../types";

export class SpotifyURLHandler implements URLHandler {
  async process(url: string): Promise<HandlerResult> {
    const normalized = addHttpsPrefix(url);
    const uri = Spicetify.URI.from(normalized) ?? Spicetify.URI.from(url);

    if (!uri) {
      return { status: HandlerStatus.NOT_MATCHING };
    }

    if (!Spicetify.URI.isTrack(uri)) {
      return { status: HandlerStatus.WRONG_CONTENT };
    }

    const track = await getTrack(uri);

    if (!track) {
      return { status: HandlerStatus.WRONG_CONTENT };
    }

    return { status: HandlerStatus.SUCCESS, track: track };
  }
}
