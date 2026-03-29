import {
  getFavoriteTracks,
  getAlbumTracks,
  getArtistDiscographyAll,
  getPlaylistMetadata,
  getPlaylistTracks,
} from "@api/spotify";
import { getAllowDuplicateRandomTracks } from "@config/settings";
import { Track } from "@entities";
import { queue } from "@features/queue";
import { addHttpsPrefix, randomIndex } from "@utils";

export enum RandomSourceErrorCode {
  INVALID_SOURCE = "INVALID_SOURCE",
  PLAYLIST_NOT_FOUND = "PLAYLIST_NOT_FOUND",
  ARTIST_NOT_FOUND = "ARTIST_NOT_FOUND",
  ALBUM_NOT_FOUND = "ALBUM_NOT_FOUND",
  NO_AVAILABLE_CANDIDATES = "NO_AVAILABLE_CANDIDATES",
}

export interface RandomPickResult {
  track?: Track;
  errorCode?: RandomSourceErrorCode;
}

function parseFirstSpotifyUri(args: string[]): Spicetify.URI | null {
  for (const value of args) {
    const normalized = addHttpsPrefix(value);
    const uri = Spicetify.URI.from(normalized) ?? Spicetify.URI.from(value);
    if (uri) return uri;
  }

  return null;
}

async function pickFromFavorites(): Promise<RandomPickResult> {
  const allowDuplicates = getAllowDuplicateRandomTracks();
  const metainfo = await getFavoriteTracks();

  const totalLength = metainfo.totalLength;

  if (!totalLength) {
    return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
  }

  const tried = new Set<number>();

  while (tried.size < totalLength) {
    const offset = randomIndex(totalLength);

    if (tried.has(offset)) continue;
    tried.add(offset);

    const response = await getFavoriteTracks(offset, 1);

    const item = response?.items?.[0];
    if (!item || !item.isPlayable) continue;

    if (!allowDuplicates && queue.hasTrack(item.uri)) continue;

    const track = Track.fromSpotifyTrack(item);

    return { track: track };
  }

  return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
}

async function pickFromPlaylist(
  playlistUri: Spicetify.URI,
): Promise<RandomPickResult> {
  const allowDuplicates = getAllowDuplicateRandomTracks();

  let metadata;
  try {
    metadata = await getPlaylistMetadata(playlistUri);
  } catch (error) {
    console.log("[RandomRequest] Failed to get playlist metadata", error);
    return { errorCode: RandomSourceErrorCode.PLAYLIST_NOT_FOUND };
  }

  const totalLength = metadata.totalLength;

  if (!totalLength) {
    return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
  }

  const tried = new Set<number>();

  while (tried.size < totalLength) {
    const offset = randomIndex(totalLength);

    if (tried.has(offset)) continue;
    tried.add(offset);

    let response;
    try {
      response = await getPlaylistTracks(playlistUri, 1, offset);
    } catch (error) {
      console.warn("[RandomRequest] Failed to get playlist track", error);
      continue;
    }

    const item = response?.items?.[0];

    if (!item || !item.isPlayable) continue;

    if (!allowDuplicates && queue.hasTrack(item.uri)) continue;

    const track = Track.fromSpotifyTrack(item);

    return { track: track };
  }

  return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
}

async function pickFromAlbum(
  albumUri: Spicetify.URI,
): Promise<RandomPickResult> {
  const allowDuplicates = getAllowDuplicateRandomTracks();

  let response;
  try {
    response = await getAlbumTracks(albumUri);
  } catch (error) {
    console.warn("[RandomRequest] Failed to get album tracks", error);
    return { errorCode: RandomSourceErrorCode.ALBUM_NOT_FOUND };
  }

  const totalLength = response?.tracksV2?.items?.length;

  if (!totalLength) {
    return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
  }

  const tried = new Set<number>();

  while (tried.size < totalLength) {
    const offset = randomIndex(totalLength);

    if (tried.has(offset)) continue;
    tried.add(offset);

    let trackResponse;
    try {
      trackResponse = await getAlbumTracks(albumUri, 1, offset);
    } catch (error) {
      console.warn("[RandomRequest] Failed to get album track", error);
      continue;
    }

    const item = trackResponse?.tracksV2?.items?.[0]?.track;

    if (!item?.playability?.playable) continue;

    if (!allowDuplicates && queue.hasTrack(item.uri)) continue;

    const track = new Track(
      item.uri,
      item.name,
      item.artists.items.map((artist) => artist.profile.name),
    );

    return { track: track };
  }

  return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
}

async function pickFromArtist(
  artistUri: Spicetify.URI,
): Promise<RandomPickResult> {
  let response;
  try {
    response = await getArtistDiscographyAll(artistUri);
  } catch (error) {
    console.warn("[RandomRequest] Failed to get artist discography", error);
    return { errorCode: RandomSourceErrorCode.ARTIST_NOT_FOUND };
  }

  const albums =
    response?.items?.flatMap((item) => item.releases?.items ?? []) ?? [];

  if (!albums.length) {
    return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
  }

  const tried = new Set<number>();

  while (tried.size < albums.length) {
    const offset = randomIndex(albums.length);

    if (tried.has(offset)) continue;
    tried.add(offset);

    const album = albums[offset];
    if (!album?.uri && !album?.playability?.playable) continue;

    const albumUri = Spicetify.URI.from(album.uri);
    if (!albumUri || !Spicetify.URI.isAlbum(albumUri)) continue;

    const albumPick = await pickFromAlbum(albumUri);
    if (albumPick.track) return albumPick;
  }

  return { errorCode: RandomSourceErrorCode.NO_AVAILABLE_CANDIDATES };
}

export async function pickRandomTrack(
  args: string[],
): Promise<RandomPickResult> {
  if (!args.length) {
    return pickFromFavorites();
  }

  const uri = parseFirstSpotifyUri(args);
  if (!uri) {
    return { errorCode: RandomSourceErrorCode.INVALID_SOURCE };
  }

  if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
    return pickFromPlaylist(uri);
  }

  if (Spicetify.URI.isArtist(uri)) {
    return pickFromArtist(uri);
  }

  if (Spicetify.URI.isAlbum(uri)) {
    return pickFromAlbum(uri);
  }

  return { errorCode: RandomSourceErrorCode.INVALID_SOURCE };
}
