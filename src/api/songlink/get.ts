import type { SongLinkResponse } from "./types";

const PROXY_BASE = "https://mr-cors-proxy.vercel.app/api/proxy";
const SONG_LINK_API_BASE = "https://api.song.link/v1-alpha.1/links";

export async function getSongLink(
  url: string,
): Promise<SongLinkResponse | null> {
  const apiSongLinkUrl = new URL(SONG_LINK_API_BASE);
  apiSongLinkUrl.searchParams.set("url", url);
  apiSongLinkUrl.searchParams.set("songIfSingle", "true");
  apiSongLinkUrl.searchParams.set("type", "song");

  const proxyUrl = new URL(PROXY_BASE);
  proxyUrl.searchParams.set("url", apiSongLinkUrl.toString());

  const response = await fetch(proxyUrl.toString());

  if (!response.ok) return null;

  return await response.json();
}
