import { User } from "@bot/types";
import { Track } from "@entities/track";
import { LocaleDefinition } from "@locales";
import { LimitInfo } from "@features/limits";

const locale: LocaleDefinition = {
  sr: {
    noArgs: "Будь ласка, вкажіть назву пісні або URL",
    trackNotFound: "Пісню не знайдено",
    tracksNotFound: "Не вдалося знайти пісні",

    addedTrack: (track: Track) => `Пісню "${track.title}" додано до черги`,
    addedTracks: (count: number) => `До черги додано ${count} пісень`,

    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} додав "${track.title}" до черги`,
    userAddedTracks: (user: User, count: number) =>
      `${user.displayName} додав ${count} пісень до черги`,

    userLimit: (limit: LimitInfo) => `Ви досягли обмеження у ${limit.max} пісень`,
    queueLimit: (limit: LimitInfo) => `Черга заповнена на ${limit.max} пісень`,
  },

  rr: {
    invalidSource:
      "Укажіть посилання Spotify на виконавця, плейліст або альбом",
    playlistNotFound: "Плейліст не знайдено або він недоступний",
    albumNotFound: "Альбом не знайдено або він недоступний",
    artistNotFound: "Виконавця не знайдено або він недоступний",
    noAvailableCandidates: "Немає відповідних пісень для додавання",

    addedTrack: (track: Track) =>
      `Випадково вибрано пісню "${track.title}" і додано до черги`,
    userAddedTrack: (user: User, track: Track) =>
      `${user.displayName} випадково вибрав "${track.title}" і додав до черги`,
  },

  song: {
    noSongPlaying: "Зараз нічого не грає",
    failedToGet: "Не вдалося отримати дані про поточну пісню",

    nowPlaying: (name: string, artists: string) => `"${name}" виконує ${artists}`,
  },

  rm: {
    emptyQueue: "Ваша черга порожня",
    trackNotFound: "Пісню не знайдено",

    trackDeleted: (track: Track) => `Пісню "${track.title}" видалено`,
  },

  clear: {
    cleared: "Чергу Spotify очищено",
  },

  prev: {
    success: "Перемкнено на попередню пісню",
    notPlayingTrack: "Зараз нічого не грає",
    noPrevTrack: "Немає попередньої пісні для перемикання",
  },

  next: {
    success: "Перемкнено на наступну пісню",
    notPlayingTrack: "Зараз нічого не грає",
    noNextTrack: "Немає наступної пісні для перемикання",
  },

  volume: {
    current: (volume: number) => `Поточна гучність: ${volume}%`,
    updated: (previousVolume: number, volume: number) =>
      `Гучність: ${previousVolume}% -> ${volume}%`,
  },

  internal: {
    error: "Сталася внутрішня помилка",
    noArtist: "Внутрішня помилка: виконавця не знайдено",
    permissionDenied: "Ви не маєте права використовувати цю команду",
  },
};

export default locale;
