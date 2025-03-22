export interface SongLinkResponse {
  entityUniqueId: string;
  userCountry: string;
  pageUrl: string;
  entitiesByUniqueId: {
    [key: string]: SongLinkEntity;
  };
  linksByPlatform: {
    [P in SongLinkPlatform]?: P extends "spotify"
      ? SongLinkSpotifyPlatformLink
      : SongLinkPlatformLink;
  };
}

export interface SongLinkEntity {
  id: string;
  type: string;
  title: string;
  artistName: string;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  apiProvider: SongLinkApiProvider;
  platforms: SongLinkPlatform[];
}

export interface SongLinkPlatformLink {
  country: string;
  url: string;
  entityUniqueId: string;
}

export interface SongLinkSpotifyPlatformLink extends SongLinkPlatformLink {
  nativeAppUriDesktop: string;
}

export type SongLinkPlatform =
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

export type SongLinkApiProvider =
  | "amazon"
  | "audius"
  | "boomplay"
  | "pandora"
  | "soundcloud"
  | "spotify"
  | "yandex"
  | "youtube";
