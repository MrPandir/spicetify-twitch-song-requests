import type { Track as SpotifyTrack } from "@api/spotify";

export class Track {
  uri: Spicetify.URI;
  title: string;
  artists_names: string[];

  constructor(
    uri: Spicetify.URI | string,
    title: string,
    artists_names: string[],
  ) {
    if (typeof uri === "string") {
      const uriObj = Spicetify.URI.from(uri);
      if (!uriObj) throw new Error(`Invalid URI: ${uri}`);
      uri = uriObj;
    }

    if (uri?.type !== "track")
      throw new Error(`URI type must be "track": ${uri}`);

    this.uri = uri;
    this.title = title;
    this.artists_names = artists_names;
  }

  static fromSpotifyTrack(spotifyTrack: SpotifyTrack): Track {
    const uri = Spicetify.URI.from(spotifyTrack.uri)!;
    return new Track(
      uri,
      spotifyTrack.name,
      spotifyTrack.artists.map((artist) => artist.name),
    );
  }

  getArtists(separator: string = ", "): string {
    return this.artists_names.join(separator);
  }
}
