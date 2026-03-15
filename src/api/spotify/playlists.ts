import type {
  PlaylistApiOptions,
  PlaylistMetadataResponse,
  PlaylistTracksOptions,
  PlaylistTracksResponse,
} from "./types/playlists";

export async function getPlaylistMetadata(
  playlistUri: Spicetify.URI,
  options: PlaylistApiOptions = {
    hydrateCollaboratorsWithMembers: false,
    withSync: true,
  },
): Promise<PlaylistMetadataResponse> {
  return Spicetify.Platform.PlaylistAPI.getMetadata(
    playlistUri.toString(),
    options,
  );
}

export async function getPlaylistTracks(
  playlistUri: Spicetify.URI,
  limit: number,
  offset: number,
  options?: PlaylistTracksOptions,
): Promise<PlaylistTracksResponse> {
  return Spicetify.Platform.PlaylistAPI.getContents(playlistUri.toString(), {
    limit: limit,
    offset: offset,
    ...options,
  });
}
