import type { LocaleDefinition } from "@locales";

export type TranslationParams<
  D extends keyof LocaleDefinition,
  K extends keyof LocaleDefinition[D],
> = LocaleDefinition[D][K] extends (...args: infer P) => any ? P : never[];
