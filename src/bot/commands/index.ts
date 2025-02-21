import sr from "./sr";
import type { CommandExecute } from "../types";

export const commands: Record<string, CommandExecute> = {
  sr: sr.execute,
};
