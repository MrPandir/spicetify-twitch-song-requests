import type { CommandExecutor, CommandName } from "../types";
import clear from "./clear";
import rm from "./rm";
import rr from "./rr";
import rrn from "./rrn";
import song from "./song";
import sr from "./sr";
import srn from "./srn";

export const commands: Record<CommandName, CommandExecutor> = {
  clear: clear,
  rr: rr,
  rrn: rrn,
  sr: sr,
  srn: srn,
  song: song,
  rm: rm,
};
