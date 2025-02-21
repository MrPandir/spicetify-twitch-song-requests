export type URI = string;

export interface URLHandler {
  process(url: string): Promise<URI | null>;
}
