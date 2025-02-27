import type { CommandExecute } from "../types";
import sr from "./sr";
import song from "./song";

export const commands: Record<string, CommandExecute> = {
  sr: sr.execute,
  song: song.execute,
};
