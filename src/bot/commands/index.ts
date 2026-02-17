import type { CommandExecutor, CommandName } from "../types";
import rm from "./rm";
import song from "./song";
import sr from "./sr";
import srn from "./srn";

export const commands: Record<CommandName, CommandExecutor> = {
  sr: sr,
  srn: srn,
  song: song,
  rm: rm,
};
