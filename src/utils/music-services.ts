import { addHttpsPrefix } from "./text-utils";

// Services accepted by song.link
export const MUSIC_DOMAINS: string[] = [
  "spotify.com",
  "open.spotify.com",
  "play.spotify.com",
  "spotify.link",
  "itunes.apple.com",
  "geo.itunes.apple.com",
  "music.apple.com",
  "geo.music.apple.com",
  "youtube.com",
  "youtu.be",
  "music.youtube.com",
  "m.youtube.com",
  "play.google.com",
  "music.google.com",
  "pandora.com",
  "deezer.com",
  "tidal.com",
  "listen.tidal.com",
  "music.amazon.com",
  "music.amazon.co.uk",
  "music.amazon.de",
  "amazon.com",
  "soundcloud.com",
  "on.soundcloud.com",
  "snd.sc",
  "napster.com",
  "music.yandex.ru",
  "music.yandex.com",
  "spinrilla.com",
  "audius.co",
  "anghami.com",
  "boomplay.com",
  "boomplaymusic.com",
  "audiomack.com",
  "m.audiomack.com",
  "bandcamp.com",
];

export function hasMatchingDomain(
  url: string,
  domains: string[] = MUSIC_DOMAINS,
): boolean {
  const fullUrl = addHttpsPrefix(url);

  let hostname: string;
  try {
    hostname = new URL(fullUrl).hostname.toLowerCase();
  } catch {
    return false;
  }

  return domains.some(
    (domain) => hostname === domain || hostname.endsWith("." + domain),
  );
}
