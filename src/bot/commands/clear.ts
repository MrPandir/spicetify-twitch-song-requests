import { reply } from "@bot";
import { queue } from "@features/queue";
import type { CommandExecutor } from "../types";

const executor: CommandExecutor = async function () {
  await queue.clearAllTracks();
  return reply("clear", "cleared");
};

export default executor;
