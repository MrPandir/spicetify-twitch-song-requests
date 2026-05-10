import type { User } from "@bot/types";
import {
  getCommandPermissions,
  type PermissionKeyword,
} from "@ui/settings";

function hasKeywordAccess(
  user: User,
  keywords: Set<PermissionKeyword>,
): boolean {
  if (keywords.has("everyone")) return true;
  if (keywords.has("mods") && user.isModerator) return true;
  if (keywords.has("subs") && user.isSubscriber) return true;
  if (keywords.has("vips") && user.isVip) return true;

  return false;
}

export function canExecuteCommand(command: string, user: User): boolean {
  if (user.isBroadcaster) return true;

  const permissions = getCommandPermissions(command);

  if (hasKeywordAccess(user, permissions.keywords)) return true;

  if (permissions.userIds.has(user.id)) return true;

  return permissions.usernames.has(user.userName);
}
