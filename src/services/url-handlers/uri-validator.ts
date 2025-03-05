import { type HandlerResult, HandlerStatus } from "./types";

export function validateSpotifyUri(uri: Spicetify.URI | null): HandlerResult {
  if (!uri) {
    return { uri: null, status: HandlerStatus.NOT_MATCHING };
  }
  if (uri.type !== "track") {
    return { uri: uri, status: HandlerStatus.WRONG_CONTENT };
  }

  return { uri: uri, status: HandlerStatus.SUCCESS };
}
