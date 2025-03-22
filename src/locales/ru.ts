import { User } from "@bot/types";
import { Track } from "@entities/track";

const locale = {
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

  internal: {
    error: "Произошла внутренняя ошибка",
    noArtist: "Внутренняя ошибка: Исполнитель не найден",
  },
};

export default locale;
