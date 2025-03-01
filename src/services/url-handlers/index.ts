import { SpotifyURLHandler } from "./handlers/spotify";
import { YouTubeURLHandler } from "./handlers/youtube";
import { URLProcessor } from "./processor";
import { URI } from "./types";

export * from "./types";
export * from "./processor";
export * from "./handlers/spotify";
export * from "./handlers/youtube";

export const urlProcessor = new URLProcessor();
urlProcessor.registerHandler(new SpotifyURLHandler());
urlProcessor.registerHandler(new YouTubeURLHandler());

export async function getUrisFromMessage(links: string[]): Promise<URI[]> {
  return (
    await Promise.all(links.map((link) => urlProcessor.processURL(link)))
  ).filter((uri) => uri !== null);
}
