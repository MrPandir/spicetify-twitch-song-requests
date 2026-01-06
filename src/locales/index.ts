import en from "./en";
import ru from "./ru";
import pt_br from "./pt_BR";

export enum Language {
  EN = "EN",
  RU = "RU",
  PT_BR = "pt BR",
}

export const locales: Record<Language, LocaleDefinition> = {
  [Language.EN]: en,
  [Language.RU]: ru,
  [Language.PT_BR]: pt_br,
};

export type LocaleDefinition = typeof en;
