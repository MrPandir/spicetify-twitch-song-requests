export interface URLHandler {
  process(url: string): Promise<HandlerResult>;
}

export interface HandlerResult {
  uri: Spicetify.URI | null;
  status: HandlerStatus | null;
}

export enum HandlerStatus {
  NOT_MATCHING = "NOT_MATCHING",
  WRONG_CONTENT = "WRONG_CONTENT",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
}
