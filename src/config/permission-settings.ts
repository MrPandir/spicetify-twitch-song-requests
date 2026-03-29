import { SettingsSection } from "spcr-settings";
import { nameId } from "@settings.json";

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
  permissionScopes.addInput("song", "!song", {
    defaultValue: "everyone",
    suggestions: permissionKeywords,
    props: {
      onBlur: (event) => {
        return normalizeField("song", event.currentTarget.value);
      },
    },
  });

  permissionScopes.addInput("sr", "!sr <song name | link> [link...]", {
    defaultValue: "everyone",
    suggestions: permissionKeywords,
    props: {
      onBlur: (event) => {
        return normalizeField("sr", event.currentTarget.value);
      },
    },
  });
  permissionScopes.addInput("srn", "!srn <song name | link> [link...]", {
    defaultValue: "mods, subs",
    suggestions: permissionKeywords,
    props: {
      onBlur: (event) => {
        return normalizeField("srn", event.currentTarget.value);
      },
    },
  });

  permissionScopes.addInput(
    "rr",
    "!rr [artist link | playlist link | album link]",
    {
      defaultValue: "everyone",
      suggestions: permissionKeywords,
      props: {
        onBlur: (event) => {
          return normalizeField("rr", event.currentTarget.value);
        },
      },
    },
  );
  permissionScopes.addInput(
    "rrn",
    "!rrn [artist link | playlist link | album link]",
    {
      defaultValue: "mods, subs",
      suggestions: permissionKeywords,
      props: {
        onBlur: (event) => {
          return normalizeField("rrn", event.currentTarget.value);
        },
      },
    },
  );

  permissionScopes.addInput("clear", "!clear", {
    defaultValue: "",
    suggestions: permissionKeywords,
    props: {
      onBlur: (event) => {
        return normalizeField("clear", event.currentTarget.value);
      },
    },
  });

  permissionScopes.addInput("volume", "!volume [0-100]", {
    defaultValue: "mods",
    suggestions: permissionKeywords,
    props: {
      onBlur: (event) => {
        return normalizeField("volume", event.currentTarget.value);
      },
    },
  });

  permissionScopes.addInput(
    "rm",
    "!rm [match by title or artist | index from the end of the queue]",
    {
      defaultValue: "everyone",
      suggestions: permissionKeywords,
      props: {
        onBlur: (event) => {
          return normalizeField("rm", event.currentTarget.value);
        },
      },
    },
  );

  permissionScopes.addToggle(
    "allowGlobalDeleteForMods",
    "Allow moderators to remove any track from the queue",
    true,
  );

  await permissionScopes.pushSettings();
}
