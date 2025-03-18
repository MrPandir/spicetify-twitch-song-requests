import en from "./en";
import ru from "./ru";

export enum Language {
  EN = "EN",
  RU = "RU",
}

export const locales: Record<Language, LocaleDefinition> = {
  [Language.EN]: en,
  [Language.RU]: ru,
};

export type LocaleDefinition = typeof en;
