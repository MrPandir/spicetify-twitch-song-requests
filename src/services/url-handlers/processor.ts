import { type URLHandler, HandlerStatus } from "./types";

export class URLProcessor {
  private handlers: URLHandler[] = [];

  registerHandler(handler: URLHandler) {
    this.handlers.push(handler);
  }

  async processURL(url: string): Promise<Spicetify.URI | null> {
    for (const handler of this.handlers) {
      const result = await handler.process(url);

      // Check if handler succeeded and has a valid URI
      if (result.status === HandlerStatus.SUCCESS && result.uri) {
        return result.uri;
      }

      // URL pattern doesn't match, try next handler
      if (result.status === HandlerStatus.NOT_MATCHING) {
        continue;
      }

      // Content type is invalid, stop processing
      if (result.status === HandlerStatus.WRONG_CONTENT) {
        return null;
      }

      // Handler failed, try next handler
      if (result.status === HandlerStatus.FAILED) {
        continue;
      }
    }
    return null;
  }
}
