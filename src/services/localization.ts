import type { TranslationParams } from "@/types/localization";
import { getLanguage } from "@config";
import { locales, type LocaleDefinition } from "@locales";

function getTranslationFunctionOrText<
  D extends keyof LocaleDefinition,
  K extends keyof LocaleDefinition[D],
>(domain: D, key: K): LocaleDefinition[D][K] {
  const language = getLanguage();

  try {
    return locales[language][domain][key];
  } catch (e) {
    throw new Error(
      `Missing translation: ${language}.${domain}.${key as string}`,
    );
  }
}

export function getTranslation<
  D extends keyof LocaleDefinition,
  K extends keyof LocaleDefinition[D],
>(domain: D, key: K, ...params: TranslationParams<D, K>): string {
  const funcOrText = getTranslationFunctionOrText(domain, key);
  if (typeof funcOrText === "string") {
    return funcOrText;
  } else if (typeof funcOrText === "function") {
    return funcOrText(...params);
  }

  throw new Error(`Invalid translation type: ${typeof funcOrText}`);
}
