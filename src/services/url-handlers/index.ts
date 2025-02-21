import { SpotifyURLHandler } from "./spotify-handler";
import { YouTubeURLHandler } from "./youtube-handler";
import { URLProcessor } from "./processor";

export * from "./types";
export * from "./processor";
export * from "./spotify-handler";
export * from "./youtube-handler";

export const urlProcessor = new URLProcessor();
urlProcessor.registerHandler(new SpotifyURLHandler());
urlProcessor.registerHandler(new YouTubeURLHandler());
