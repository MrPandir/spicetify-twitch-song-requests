import type { URLHandler, URI } from "./types";

export class URLProcessor {
  private handlers: URLHandler[] = [];

  registerHandler(handler: URLHandler) {
    this.handlers.push(handler);
  }

  async processURL(url: string): Promise<URI | null> {
    for (const handler of this.handlers) {
      const result = await handler.process(url);
      if (result) return result;
    }
    return null;
  }
}
