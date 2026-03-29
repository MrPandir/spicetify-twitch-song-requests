import { User } from "@bot/types";
import { Track } from "@entities/track";
import { LocaleDefinition } from "@locales";
import { LimitInfo } from "@features/limits";

const locale: LocaleDefinition = {
  sr: {
    noArgs: "Пожалуйста, укажите название трека или URL",
    trackNotFound: "Трек не найден",
    tracksNotFound: "Не удалось найти треки",

    addedTrack: (track: Track) => `Добавлено "${track.title}" в очередь`,
    addedTracks: (count: number) => `${count} треков добавлено в очередь`,

    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} добавил "${track.title}" в очередь`,
    userAddedTracks: (user: User, count: number) =>
      `${user.displayName} добавил ${count} треков в очередь`,

    userLimit: (limit: LimitInfo) => `Вы достигли лимита в ${limit.max} треков`,
    queueLimit: (limit: LimitInfo) => `Очередь заполнена ${limit.max} треков`,
  },

  rr: {
    invalidSource: "Укажите ссылку Spotify на артиста, плейлист или альбом",
    playlistNotFound: "Плейлист не найден или недоступен",
    albumNotFound: "Альбом не найден или недоступен",
    artistNotFound: "Артист не найден или недоступен",
    noAvailableCandidates: "Нет подходящих треков для добавления",

    addedTrack: (track: Track) =>
      `Случайно выбран трек "${track.title}" и добавлен в очередь`,
    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} случайно выбрал "${track.title}" и добавил в очередь`,
  },

  song: {
    noSongPlaying: "Сейчас ничего не играет",
    failedToGet: "Не удалось получить информацию о текущем треке",

    nowPlaying: (name: string, artists: string) => `"${name}" от ${artists}`,
  },

  rm: {
    emptyQueue: "Ваша очередь пуста",
    trackNotFound: "Трек не найден",

    trackDeleted: (track: Track) => `Трек "${track.title}" удален`,
  },

  clear: {
    cleared: "Очередь Spotify была очищена",
  },

  volume: {
    current: (volume: number) => `Текущая громкость: ${volume}%`,
    updated: (previousVolume: number, volume: number) =>
      `Громкость изменена с ${previousVolume}% на ${volume}%`,
  },

  internal: {
    error: "Произошла внутренняя ошибка",
    noArtist: "Внутренняя ошибка: Исполнитель не найден",
    permissionDenied: "У вас нет прав для использования этой команды",
  },
};

export default locale;
