import { SettingsSection } from "spcr-settings";
import { nameId } from "@settings.json";
import { commandDefinitions } from "./command-settings";

export const permissionScopes = new SettingsSection(
  "Twitch Song Requests (Permission Scopes)",
  nameId + "-permission-scopes",
);

export type PermissionKeyword = "everyone" | "mods" | "subs" | "vips";

export interface ParsedCommandPermissions {
  keywords: Set<PermissionKeyword>;
  usernames: Set<string>;
  userIds: Set<string>;
  normalizedValue: string;
}

const permissionKeywords: PermissionKeyword[] = [
  "everyone",
  "mods",
  "subs",
  "vips",
];
const commandPermissionsStore = new Map<string, ParsedCommandPermissions>();

export function parseCommandPermissions(
  value: string | null | undefined,
): ParsedCommandPermissions {
  const keywords = new Set<PermissionKeyword>();
  const usernames = new Set<string>();
  const userIds = new Set<string>();

  const tokens = (value ?? "")
    .split(",")
    .map((token) => token.replace(/\s+/g, "").toLowerCase())
    .filter((token) => token.length > 0);

  for (const token of tokens) {
    if (permissionKeywords.includes(token as PermissionKeyword)) {
      keywords.add(token as PermissionKeyword);
      continue;
    }

    if (token.startsWith("id=")) {
      const userId = token.slice(3);
      if (userId) {
        userIds.add(userId);
      }
      continue;
    }

    usernames.add(token);
  }

  const normalizedValue = [
    ...keywords,
    ...usernames,
    ...[...userIds].map((userId) => `id=${userId}`),
  ].join(", ");

  return {
    keywords,
    usernames,
    userIds,
    normalizedValue,
  };
}

function normalizeField(command: string, rawValue: string) {
  const parsedPermissions = parseCommandPermissions(rawValue);

  permissionScopes.setFieldValue(command, parsedPermissions.normalizedValue);
  commandPermissionsStore.set(command, parsedPermissions);

  return parsedPermissions.normalizedValue;
}

export function getCommandPermissions(
  command: string,
): ParsedCommandPermissions {
  const storedPermissions = commandPermissionsStore.get(command);
  if (storedPermissions) return storedPermissions;

  const rawValue = permissionScopes.getFieldValue<string>(command) ?? "";

  const parsedPermissions = parseCommandPermissions(rawValue);

  commandPermissionsStore.set(command, parsedPermissions);

  return parsedPermissions;
}

export function getAllowGlobalDeleteForMods(): boolean {
  return !!permissionScopes.getFieldValue("allowGlobalDeleteForMods");
}

export async function addPermissionScopesSettings() {
  for (const definition of commandDefinitions) {
    permissionScopes.addInput(definition.command, definition.label, {
      defaultValue: definition.defaultPermission,
      suggestions: permissionKeywords,
      props: {
        onBlur: (event) => {
          return normalizeField(definition.command, event.currentTarget.value);
        },
      },
    });
  }

  permissionScopes.addToggle(
    "allowGlobalDeleteForMods",
    "Allow moderators to remove any track from the queue",
    true,
  );

  await permissionScopes.pushSettings();
}
