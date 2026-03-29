import { getTranslation } from "@locales";
import type { LocaleDefinition, TranslationParams } from "@locales";
import type { BotResponse, ResponseType } from "@bot/types";

function createResponse<
  D extends keyof LocaleDefinition,
  K extends keyof LocaleDefinition[D],
>(
  type: ResponseType,
  domain: D,
  key: K,
  ...params: TranslationParams<D, K>
): BotResponse {
  const text = getTranslation(domain, key, ...params);
  return { type, text };
}

type Response = <
  D extends keyof LocaleDefinition,
  K extends keyof LocaleDefinition[D],
>(
  domain: D,
  key: K,
  ...params: TranslationParams<D, K>
) => BotResponse;

export const reply: Response = (domain, key, ...params) =>
  createResponse("reply", domain, key, ...params);
export const message: Response = (domain, key, ...params) =>
  createResponse("message", domain, key, ...params);
export const notification: Response = (domain, key, ...params) =>
  createResponse("notification", domain, key, ...params);
