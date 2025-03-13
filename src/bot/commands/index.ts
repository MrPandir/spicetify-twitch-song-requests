import type { CommandExecute } from "../types";
import sr from "./sr";
import song from "./song";
import rm from "./rm";

export const commands: Record<string, CommandExecute> = {
  sr: sr.execute,
  song: song.execute,
  rm: rm.execute,
};
