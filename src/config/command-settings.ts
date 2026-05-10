export interface CommandDefinition {
  command: string;
  label: string;
  shortDescription: string;
  defaultPermission: string;
}

export const commandDefinitions: CommandDefinition[] = [
  {
    command: "song",
    label: "!song",
    shortDescription: "Current song",
    defaultPermission: "everyone",
  },
  {
    command: "sr",
    label: "!sr <song name | link> [link...]",
    shortDescription: "Song request",
    defaultPermission: "everyone",
  },
  {
    command: "srn",
    label: "!srn <song name | link> [link...]",
    shortDescription: "Priority song request",
    defaultPermission: "mods, subs",
  },
  {
    command: "rr",
    label: "!rr [artist link | playlist link | album link]",
    shortDescription: "Random song request",
    defaultPermission: "everyone",
  },
  {
    command: "rrn",
    label: "!rrn [artist link | playlist link | album link]",
    shortDescription: "Priority random song request",
    defaultPermission: "mods, subs",
  },
  {
    command: "clear",
    label: "!clear",
    shortDescription: "Clear queue",
    defaultPermission: "",
  },
  {
    command: "prev",
    label: "!prev",
    shortDescription: "Previous track",
    defaultPermission: "mods",
  },
  {
    command: "next",
    label: "!next",
    shortDescription: "Next track",
    defaultPermission: "mods",
  },
  {
    command: "volume",
    label: "!volume [0-100]",
    shortDescription: "Volume",
    defaultPermission: "mods",
  },
  {
    command: "rm",
    label: "!rm [match by title or artist | index from the end of the queue]",
    shortDescription: "Remove track",
    defaultPermission: "everyone",
  },
];
