import { Queue } from "./queue";

export type { QueueRequester } from "./types";

// TODO: Implement state saving from LocalStorage
export const queue = new Queue();
Spicetify.Player.origin._events.addListener(
  "queue_update",
  queue.updateHandler,
);
