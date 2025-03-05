import type { URLHandler, HandlerResult } from "../types";
import { addHttpsPrefix } from "@utils";
import { validateSpotifyUri } from "../uri-validator";

export class SpotifyURLHandler implements URLHandler {
  async process(url: string): Promise<HandlerResult> {
    url = addHttpsPrefix(url);

    const uri = Spicetify.URI.from(url);

    return validateSpotifyUri(uri);
  }
}
