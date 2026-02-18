import { reply } from "@bot";
import { queue } from "@services/queue";
import { isModOrBroadcaster } from "@utils";
import type { CommandExecutor } from "../types";

const executor: CommandExecutor = async function (client, author, args, tags) {
  if (!isModOrBroadcaster(client, author.userName, tags)) {
    return reply("clear", "permissionDenied");
  }

  await queue.clearAllTracks();
  return reply("clear", "cleared");
};

export default executor;
