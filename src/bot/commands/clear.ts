import { reply } from "@bot";
import { queue } from "@services/queue";
import type { CommandExecutor } from "../types";

const executor: CommandExecutor = async function (client, author, args, tags) {
  await queue.clearAllTracks();
  return reply("clear", "cleared");
};

export default executor;
