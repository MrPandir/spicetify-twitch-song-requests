import type { User } from "@bot/types";
import type { QueueRequester } from "@features/queue";

export function toQueueRequester(author: User): QueueRequester {
  return {
    id: author.id,
    userName: author.userName,
    displayName: author.displayName,
  };
}
