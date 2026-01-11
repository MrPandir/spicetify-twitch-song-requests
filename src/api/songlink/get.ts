import type { SongLinkResponse } from "./types";

const proxyUrl = "https://mr-cors-proxy.vercel.app/api/proxy?url=";
const apiUrl = new URL(proxyUrl + "https://api.song.link/v1-alpha.1/links");
apiUrl.searchParams.append("songIfSingle", "true");
apiUrl.searchParams.append("type", "song");

export async function getSongLink(
  url: string,
): Promise<SongLinkResponse | null> {
  apiUrl.searchParams.set("url", encodeURIComponent(url));
  const response = await fetch(apiUrl.toString());

  if (!response.ok) return null;

  return await response.json();
}
