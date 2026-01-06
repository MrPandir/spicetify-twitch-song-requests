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

  internal: {
    error: "Ocorreu um erro interno",
    noArtist: "Erro interno: Nenhum artista encontrado",
  },
};

export default locale;
