import type { SpotifySimpleArtist } from "./artists";
import type { SimpleSpotifyAlbum, SimpleSpotifyImage } from "./albums";
import type { SpotifyDynamicColors } from "./colors";

export interface PlaylistApiOptions {
  hydrateCollaboratorsWithMembers: boolean;
  withSync: boolean;
}

export interface PlaylistTracksOptions {
  filter: string;
  filterPredicates: unknown[];
  descriptorFilter: unknown[];
  isExtraColumnsEnabled: boolean;
  extendedPlaceholderTypes: unknown[];
}

interface PlaylistUser {
  type: "user";
  uri: string;
  username: string;
  displayName: string;
  images: SimpleSpotifyImage[];
}

interface PlaylistDuration {
  milliseconds: number;
  isEstimate?: boolean;
}

interface PlaylistPermissions {
  canView: boolean;
  canAdministratePermissions: boolean;
  canCancelMembership: boolean;
  isPrivate: boolean;
  canDelete: boolean;
}

interface PlaylistFormatListData {
  type: string;
  attributes: Record<string, unknown>;
}

interface PlaylistCollaboratorItem {
  isOwner: boolean;
  tracksAdded: number;
  user: PlaylistUser;
}

interface PlaylistCollaborators {
  count: number;
  items: PlaylistCollaboratorItem[];
}

interface PlaylistWatchFeedEntityEntryPoint {
  feedUri: string;
  video: unknown | null;
  thumbnail: {
    url: string;
  };
}

export interface PlaylistTrackItem {
  type: "track";
  uid: string;
  playIndex: number | null;
  addedAt: string;
  addedBy: PlaylistUser;
  formatListAttributes: Record<string, unknown>;
  uri: string;
  name: string;
  artists: SpotifySimpleArtist[];
  duration: PlaylistDuration;
  isPlayable: boolean;
  isLocal: boolean;
  isExplicit: boolean;
  discNumber: number;
  trackNumber: number;
  is19PlusOnly: boolean;
  hasAssociatedVideo: boolean;
  hasAssociatedAudio: boolean;
  bpm: number;
  key?: any;
  mediaType?: any;
  associatedAudioUri?: any;
  isBanned: boolean;
  album: SimpleSpotifyAlbum;
}

export interface PlaylistTracksResponse {
  items: PlaylistTrackItem[];
  offset: number;
  limit: number;
  totalLength: number;
}

export interface PlaylistMetadataResponse {
  type: "playlist";
  uri: string;
  name: string;
  description: string;
  images: SimpleSpotifyImage[];
  dynamicColors: SpotifyDynamicColors;
  madeFor: unknown | null;
  owner: PlaylistUser;
  totalLength: number;
  unfilteredTotalLength: number;
  totalLikes: number;
  duration: PlaylistDuration;
  canPlay: boolean;
  isLoaded: boolean;
  isOwnedBySelf: boolean;
  isPublished: boolean;
  isRootlistable: boolean;
  isSaved: boolean;
  hasEpisodes: boolean;
  hasSpotifyTracks: boolean;
  hasSpotifyAudiobooks: boolean;
  hasPodcastChapters: boolean;
  canAdd: boolean;
  canRemove: boolean;
  canEditItems: boolean;
  formatListData: PlaylistFormatListData;
  canReportAnnotationAbuse: boolean;
  hasDateAdded: boolean;
  permissions: PlaylistPermissions;
  collaborators: PlaylistCollaborators;
  appliedLenses: unknown[];
  autoLenses: unknown[];
  watchFeedEntityEntryPoint: PlaylistWatchFeedEntityEntryPoint;
  availableSignals: unknown[];
}
