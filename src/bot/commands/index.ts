import type { CommandExecutor, CommandName } from "../types";
import clear from "./clear";
import next from "./next";
import prev from "./prev";
import rm from "./rm";
import rr from "./rr";
import rrn from "./rrn";
import song from "./song";
import sr from "./sr";
import srn from "./srn";
import volume from "./volume";

export const commands: Record<CommandName, CommandExecutor> = {
  clear: clear,
  next: next,
  prev: prev,
  rr: rr,
  rrn: rrn,
  sr: sr,
  srn: srn,
  song: song,
  rm: rm,
  volume: volume,
};
