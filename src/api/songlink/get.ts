import type { SongLinkResponse } from "./types";

const proxyUrl = "https://api.allorigins.win/get?url=";
const apiUrl = new URL(proxyUrl + "https://api.song.link/v1-alpha.1/links");
apiUrl.searchParams.append("songIfSingle", "true");
apiUrl.searchParams.append("type", "song");

export async function getSongLink(
  url: string,
): Promise<SongLinkResponse | null> {
  const targetUrl = `https://api.song.link/v1-alpha.1/links?songIfSingle=true&type=song&url=${encodeURIComponent(url)}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) return null;

  const data = await response.json();
  return JSON.parse(data.contents);
}
