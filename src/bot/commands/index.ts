import { sr } from "./sr";
import { CommandExecute } from "./types";

export const commands: Record<string, CommandExecute> = {
  sr: sr.execute,
};
