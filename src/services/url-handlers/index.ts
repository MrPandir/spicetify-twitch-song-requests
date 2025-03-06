import { SpotifyURLHandler } from "./handlers/spotify";
import { YouTubeURLHandler } from "./handlers/youtube";
import { URLProcessor } from "./processor";

export * from "./resolver";

export const urlProcessor = new URLProcessor();
urlProcessor.registerHandler(new SpotifyURLHandler());
urlProcessor.registerHandler(new YouTubeURLHandler());
