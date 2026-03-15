import { User } from "@bot/types";
import { Track } from "@entities/track";
import { LimitInfo } from "@services/limits";

const locale = {
  sr: {
    noArgs: "Por favor, forneça o nome ou a URL de uma música",
    trackNotFound: "Nenhuma música encontrada",
    tracksNotFound: "Não foi possível encontrar as músicas",

    addedTrack: (track: Track) => `Adicionada "${track.title}" à fila`,
    addedTracks: (count: number) => `${count} músicas adicionadas à fila`,

    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} adicionou "${track.title}" à fila`,
    userAddedTracks: (user: User, count: number) =>
      `${user.displayName} adicionou ${count} músicas à fila`,

    userLimit: (limit: LimitInfo) =>
      `Você atingiu o limite de ${limit.max} músicas`,
    queueLimit: (limit: LimitInfo) => `A fila está cheia: ${limit.max} músicas`,
  },

  srn: {
    noPermission:
      "Comando disponível apenas para o streamer, moderadores e assinantes",
  },

  rr: {
    invalidSource:
      "Forneça um link do Spotify de artista, playlist ou álbum",
    playlistNotFound: "Playlist não encontrada ou indisponível",
    albumNotFound: "Álbum não encontrado ou indisponível",
    artistNotFound: "Artista não encontrado ou indisponível",
    noAvailableCandidates: "Não há faixas disponíveis para adicionar",

    addedTrack: (track: Track) =>
      `Música "${track.title}" foi escolhida aleatoriamente e adicionada à fila`,
    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} escolheu aleatoriamente "${track.title}" e adicionou à fila`,
  },

  rrn: {
    noPermission:
      "Comando disponível apenas para o streamer, moderadores e assinantes",
  },

  song: {
    noSongPlaying: "Nenhuma música está tocando no momento",
    failedToGet: "Falha ao obter a música atual",

    nowPlaying: (name: string, artists: string) => `"${name}" de ${artists}`,
  },

  rm: {
    emptyQueue: "Sua fila está vazia",
    trackNotFound: "Música não encontrada",

    trackDeleted: (track: Track) => `Música "${track.title}" removida`,
  },

  clear: {
    permissionDenied: "Apenas o broadcaster e os moderadores podem usar este comando",
    cleared: "A fila do Spotify foi limpa",
  },

  internal: {
    error: "Ocorreu um erro interno",
    noArtist: "Erro interno: Nenhum artista encontrado",
  },
};

export default locale;
