import type { Client } from "tmi.js";

export interface PatchedClient extends Client {
  replay(parentMessageId: string, message: string): Promise<void>;
}

export interface InternalClient extends Client {
  _sendCommand: (
    delay: number | null,
    channel: string | null,
    command: string,
    fn?: (
      resolve: (value?: any) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) => Promise<void>;
}
