import type { URLHandler, URI } from "../types";
import { addHttpsPrefix } from "@utils";

export class SpotifyURLHandler implements URLHandler {
  async process(url: string): Promise<URI | null> {
    url = addHttpsPrefix(url);

    const uri = Spicetify.URI.from(url);
    if (!uri) {
      return null;
    }
    return uri.toURI();
  }
}
