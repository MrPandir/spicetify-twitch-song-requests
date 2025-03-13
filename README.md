# Twitch Spotifi (WIP)
A Spicetify extension that allows Twitch chat users to request songs through chat commands. Users can add songs to the listening queue using the `!sr` command followed by the song name.

# Usage

1. Start Spotify
2. Add expansion from the marketplace extensions
3. Click button on the top right near the notifications to authenticate the bot
4. Authenticate the bot account on the twitch site
5. Open spotify settings (account icon -> settings)
6. Find Twitch Spotifi section
7. Enter the nickname of the channel where the commands will be
8. Reconnect bot
9. Give the bot a moderator or VIP (if the account is not a broadcaster)
10. Users can request songs using the command:
   ```
   !sr <song name>
   !sr <spotify or youtube url> [spotify or youtube url...]
   !song
   !rm [index from the end, default: last]
   !rm <song name or song artist>
   ```

# Installation

### Prerequisites

- [Spotify](https://www.spotify.com/)
- [Spicetify](https://spicetify.app/) installed
- Node.js
- npm, yarn, or pnpm

### Building the Extension

1. Clone this repository

```bash
git clone https://github.com/MrPandir/twitch-spotifi.git && cd twitch-spotifi
```
2. Build the extension using one of the following commands:

```bash
pnpm build
```

### Adding to Spicetify

Add the extension to Spicetify's config:

```bash
spicetify config extensions twitch-spotifi.js
```

Apply the changes:

```bash
spicetify apply
```

## Development

### Watch Mode

For development with auto-rebuilding on code changes:

1. First, build the app at least once
2. Start watch mode using one of these commands:

```bash
pnpm watch
```

3. Run Spotify in watch mode:

```bash
spicetify watch -le
```

### Local Build

To build files locally and store them in a `dist` folder:

```bash
pnpm build-local
```
