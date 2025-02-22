export interface Response {
  entityUniqueId: string;
  userCountry: string;
  pageUrl: string;
  entitiesByUniqueId: {
    [key: string]: Entity;
  };
  linksByPlatform: {
    [P in Platform]: P extends "spotify" ? SpotifyPlatformLink : PlatformLink;
  };
}

export interface Entity {
  id: string;
  type: string;
  title: string;
  artistName: string;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  apiProvider: ApiProvider;
  platforms: Platform[];
}

export interface PlatformLink {
  country: string;
  url: string;
  entityUniqueId: string;
}

export interface SpotifyPlatformLink extends PlatformLink {
  nativeAppUriDesktop: string;
}

export type Platform =
  | "amazonMusic"
  | "amazonStore"
  | "audius"
  | "boomplay"
  | "pandora"
  | "soundcloud"
  | "spotify"
  | "yandex"
  | "youtube"
  | "youtubeMusic";

export type ApiProvider =
  | "amazon"
  | "audius"
  | "boomplay"
  | "pandora"
  | "soundcloud"
  | "spotify"
  | "yandex"
  | "youtube";
