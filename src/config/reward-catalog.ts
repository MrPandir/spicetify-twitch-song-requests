import { nameId } from "@settings.json";

export interface RewardEntry {
  commandId: string | null;
  rewardName: string;
}

class RewardCatalogManager {
  private data: Map<string, RewardEntry> = new Map();
  private storageKeyName = "reward-catalog";

  constructor() {
    this.load();
  }

  private get storageKey(): string {
    return `spicetify:${nameId}-${this.storageKeyName}`;
  }

  private load(): void {
    try {
      const stored = Spicetify.LocalStorage.get(this.storageKey);
      const parsed = stored ? JSON.parse(stored) : {};
      this.data = new Map(Object.entries(parsed));
    } catch (error) {
      console.error("[RewardCatalog] Failed to load data:", error);
      this.data = new Map();
    }
  }

  private save(): void {
    try {
      const obj = Object.fromEntries(this.data);
      Spicetify.LocalStorage.set(this.storageKey, JSON.stringify(obj));
    } catch (error) {
      console.error("[RewardCatalog] Failed to save data:", error);
    }
  }

  getCommand(rewardId: string): string | null {
    return this.data.get(rewardId)?.commandId || null;
  }

  getRewardNameByCommand(commandId: string): string | null {
    for (const entry of this.data.values()) {
      if (entry.commandId === commandId) {
        return entry.rewardName;
      }
    }

    return null;
  }

  getFreeRewards(): string[] {
    return Array.from(this.data.values())
      .filter((entry) => entry.commandId === null)
      .map((entry) => entry.rewardName);
  }

  setReward(rewardId: string, rewardName: string): void {
    // Find entry with same rewardName and move it to new rewardId
    for (const [key, entry] of this.data.entries()) {
      if (entry.rewardName === rewardName && key !== rewardId) {
        this.data.set(rewardId, entry);
        this.data.delete(key);
        this.save();
        return;
      }
    }

    // Get the existing commandId for this entry
    const entryCommandId = this.data.get(rewardId)?.commandId || null;

    this.data.set(rewardId, {
      commandId: entryCommandId,
      rewardName: rewardName,
    });

    this.save();
  }

  getAllByCommand(): MapIterator<RewardEntry> {
    return this.data.values();
  }

  setCommand(commandId: string, rewardName: string): void {
    for (const entry of this.data.values()) {
      if (entry.rewardName === rewardName) {
        entry.commandId = commandId;
        this.save();
        return;
      }
    }
  }

  clearCommand(commandId: string): void {
    for (const entry of this.data.values()) {
      if (entry.commandId === commandId) {
        entry.commandId = null;
        this.save();
        return;
      }
    }
  }

  getAll(): Map<string, RewardEntry> {
    return new Map(this.data);
  }

  clear(): void {
    this.data.clear();
    this.save();
  }
}

export const rewardCatalog = new RewardCatalogManager();
