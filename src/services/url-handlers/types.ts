export interface URLHandler {
  process(url: string): Promise<HandlerResult>;
}

export enum HandlerStatus {
  NOT_MATCHING = "NOT_MATCHING",
  WRONG_CONTENT = "WRONG_CONTENT",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
}

export interface SuccessHandlerResult {
  status: HandlerStatus.SUCCESS;
  uri: Spicetify.URI;
  metadata?: {
    title: string;
    artists: string[];
  };
}

export interface FailedHandlerResult {
  status:
    | HandlerStatus.FAILED
    | HandlerStatus.NOT_MATCHING
    | HandlerStatus.WRONG_CONTENT;
  uri: Spicetify.URI | null;
}

export type HandlerResult = SuccessHandlerResult | FailedHandlerResult;
