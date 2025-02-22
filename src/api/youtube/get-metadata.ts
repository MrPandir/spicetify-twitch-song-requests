import type { YouTubeVideoMetadata } from "./types";

export async function getYouTubeVideoMetadata(
  url: string,
): Promise<YouTubeVideoMetadata | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    );

    if (!response.ok) return null;

    return response.json() as Promise<YouTubeVideoMetadata>;
  } catch (error) {
    console.log(`Failed to fetch YouTube metadata: ${error}`);
    return null;
  }
}
