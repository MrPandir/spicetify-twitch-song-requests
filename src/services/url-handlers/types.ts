import { Track } from "@entities/track";

export interface URLHandler {
  process(url: string): Promise<HandlerResult>;
}

export enum HandlerStatus {
  NOT_MATCHING = "NOT_MATCHING",
  WRONG_CONTENT = "WRONG_CONTENT",
  SUCCESS = "SUCCESS",
}

export interface SuccessHandlerResult {
  status: HandlerStatus.SUCCESS;
  track: Track;
}

export interface FailedHandlerResult {
  status: HandlerStatus.NOT_MATCHING | HandlerStatus.WRONG_CONTENT;
}

export type HandlerResult = SuccessHandlerResult | FailedHandlerResult;
