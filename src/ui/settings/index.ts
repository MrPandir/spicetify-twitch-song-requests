import { addGeneralSettings } from "./general-settings";
import { addPermissionScopesSettings } from "./permission-settings";
import { addChannelPointRewardsSettings } from "./reward-settings";

export * from "./general-settings";
export * from "./permission-settings";
export * from "./reward-settings";

export async function addSettings() {
  await addGeneralSettings();
  await addPermissionScopesSettings();
  await addChannelPointRewardsSettings();
}
