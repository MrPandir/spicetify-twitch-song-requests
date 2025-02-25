import type { Response } from "./types";

const proxyUrl = "https://cors-proxy.spicetify.app/";
const apiUrl = new URL(proxyUrl + "https://api.song.link/v1-alpha.1/links");
apiUrl.searchParams.append("songIfSingle", "true");
apiUrl.searchParams.append("type", "song");

export async function getSongLink(url: string): Promise<Response | null> {
  apiUrl.searchParams.set("url", url);
  const response = await fetch(apiUrl.toString());

  if (!response.ok) return null;

  return await response.json();
}
