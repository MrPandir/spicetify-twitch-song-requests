import { SpotifyURLHandler } from "./handlers/spotify";
import { YouTubeURLHandler } from "./handlers/youtube";
import { URLProcessor } from "./processor";

export * from "./types";
export * from "./processor";
export * from "./handlers/spotify";
export * from "./handlers/youtube";

export const urlProcessor = new URLProcessor();
urlProcessor.registerHandler(new SpotifyURLHandler());
urlProcessor.registerHandler(new YouTubeURLHandler());

export async function getUrisFromMessage(
  links: string[],
): Promise<{ uris: Spicetify.URI[]; detected: boolean; length: number }> {
  const results = await Promise.all(
    links.map((link) => urlProcessor.processURL(link)),
  );
  const filteredResults = results.filter((result) => result !== null);

  return {
    uris: filteredResults,
    detected: results.length > 0,
    length: filteredResults.length,
  };
}
