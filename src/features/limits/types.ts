import { Track } from "@entities";

export interface LimitInfo {
  max: number;
  current: number;
  canBeAdded: number;
  reached: "user" | "queue";
}

export interface ApplyLimitsResult {
  tracksToAdd: Track[];
  tracksRejected: Track[];
  limit: LimitInfo;
}
