import en from "./en";
import ru from "./ru";
import pt_br from "./pt_BR";
import de from "./de";
import ua from "./ua";

export enum Language {
  EN = "English",
  RU = "Русский",
  PT_BR = "Português (Brasil)",
  DE = "Deutsch",
  UA = "Українська",
}

export const locales: Record<Language, LocaleDefinition> = {
  [Language.EN]: en,
  [Language.RU]: ru,
  [Language.PT_BR]: pt_br,
  [Language.DE]: de,
  [Language.UA]: ua,
};

export type LocaleDefinition = typeof en;

export type TranslationParams<
  D extends keyof LocaleDefinition,
  K extends keyof LocaleDefinition[D],
> = LocaleDefinition[D][K] extends (...args: infer P) => any ? P : never[];

export * from "./get-translation";
