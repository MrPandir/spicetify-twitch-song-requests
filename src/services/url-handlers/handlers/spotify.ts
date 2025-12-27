import { getTrack } from "@api/spotify";
import { Track } from "@entities/track";
import { addHttpsPrefix } from "@utils";
import { type HandlerResult, HandlerStatus, type URLHandler } from "../types";

export class SpotifyURLHandler implements URLHandler {
  async process(url: string): Promise<HandlerResult> {
    url = addHttpsPrefix(url);

    const uri = Spicetify.URI.from(url);

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
