export type ResponseType = "reply" | "message" | "notification";

export interface BotResponse {
  type: ResponseType;
  text: string;
}
