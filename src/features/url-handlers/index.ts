import { SongLinkURLHandler } from "./handlers/songlink";
import { SpotifyURLHandler } from "./handlers/spotify";
import { YouTubeURLHandler } from "./handlers/youtube";
import { URLProcessor } from "./processor";

export const urlProcessor = new URLProcessor();
urlProcessor.registerHandler(new SpotifyURLHandler());
urlProcessor.registerHandler(new SongLinkURLHandler());
urlProcessor.registerHandler(new YouTubeURLHandler());
