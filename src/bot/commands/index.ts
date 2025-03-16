import type { CommandExecutor, CommandName } from "../types";
import rm from "./rm";
import song from "./song";
import sr from "./sr";

export const commands: Record<CommandName, CommandExecutor> = {
  sr: sr,
  song: song,
  rm: rm,
};
