# Spicetify Twitch Song Requests
Twitch chat song requests for Spicetify — let viewers queue tracks using chat commands. No Spotify Premium subscription required.

# Features

- 🪙 Works **without Spotify Premium**
- ➕ `!sr` — add track by name or link
- 🚀 `!srn` — add track to the **beginning** of the queue (priority request)
- 🎲 `!rr` — add a **random** track from favorites or Spotify source link
- ⚡ `!rrn` — add a **random** track to the **beginning** of the queue (priority request)
- 🗑️ `!rm` — remove your track (last by default)
- 🧹 `!clear` — clear Spotify queue
- ⏮️ `!prev` — switch to the previous track
- ⏭️ `!next` — switch to the next track
- 🔊 `!volume` — view or set Spotify volume
- 📦 Multi-add — multiple links in one message
- 🔍 Remove by position or partial name
- 👮 Moderators can remove any track
- 🔐 Configurable command access permissions
- ⚖️ Per-user and total queue limits
- 🔁 Random duplicate toggle (allow/disallow already queued tracks)
- 🔄 Auto queue sync when track removed from Spotify
- 🔑 Permanent Twitch token (no re-auth needed)
- 🔮 Twitch Channel Point Rewards can trigger bot commands
- 🔗 Supported links from: Spotify, Apple Music, YouTube Music, Deezer, TIDAL, Amazon Music, SoundCloud, Yandex Music, and many more
- 🌍 Bot replies in: RU · EN · PT-BR · DE · UA

# Installation

> [!IMPORTANT]
> [Spotify](https://www.spotify.com/) with [Spicetify](https://spicetify.app/) is required.

## Via Marketplace (Recommended)
1. Install Marketplace: [Installation manual](https://spicetify.app/docs/customization/marketplace)
2. Open Marketplace, go to the `Extensions` tab, and search for `Twitch Song Requests`.
> [!IMPORTANT]
> If you don't see the extension, you probably need to click `Load more`.
3. Install the extension.
4. Next steps: [Authorization & Configuration](#authorization--configuration)

## Manual Installation
> [!NOTE]
> Using this installation method, you will **not** receive automatic updates.

1. Download [`twitch-song-requests.js`](https://github.com/MrPandir/spicetify-twitch-song-requests/blob/marketplace/twitch-song-requests.js) file.
2. Place the file in the path:
   - Windows: `C:\Users\<user_name>\AppData\spicetify\Extensions\`
   - Linux / macOS: `~/.config/spicetify/Extensions/`
3. Enable the extension:
```bash
spicetify config extensions twitch-song-requests.js
```
> [!TIP]
> If you want to disable it, add `-` to the end of the file name.
4. Apply the change on Spotify:
```bash
spicetify apply
```
5. Next steps: [Authorization & Configuration](#authorization--configuration)

## Download Repository and Build
1. Clone the repository:
```bash
git clone --depth 1 https://github.com/MrPandir/spicetify-twitch-song-requests.git && cd spicetify-twitch-song-requests
```
2. Build the extension:
```bash
pnpm build
```
> [!NOTE]
> This will automatically place the file in the Spicetify extensions directory.
3. Follow steps 3 and 4 from [Manual Installation](#manual-installation).
4. Next steps: [Authorization & Configuration](#authorization--configuration)

# Authorization & Configuration

1. Go to Spotify settings (account icon -> settings).
> [!TIP]
> Log in with a separate Twitch account if you want the bot to send messages as **a dedicated bot** instead of **your own account**.
> Make sure to assign VIP or Moderator status to avoid message limits.
2. Scroll down to the bottom to find the `Twitch Song Requests` section.
3. Click the `Login` button next to `Login/Logout Twitch Bot`.
4. This will open a tab in your browser. Click `Activate` and then `Authorize`.
5. After successful authorization, the button in settings will change to `Logout`.
6. Configure and enjoy.

## Twitch Channel Point Rewards

You can link Twitch channel point rewards to bot commands. When a viewer redeems that reward, the bot runs the selected command as if it was typed in chat.

> [!IMPORTANT]
> Channel point rewards without a text field do NOT work because of Twitch IRC limitations.

### How to set it up

1. Open Spotify settings and go to `Twitch Song Requests (Channel Point Rewards)`.
2. Make sure the channel point reward has a text field.
3. Click `Setup New Reward`.
4. In Twitch, redeem a channel point reward as the broadcaster with the exact title prefix, for example:
```text
Setup New Reward: Song request
```
5. After that, the reward will appear in the dropdown list next to the command.
6. Pick the command you want to trigger from that reward.
7. Repeat the process for more rewards.

### Notes

- The setup step only works for the broadcaster account.
- The reward title must start with the prefix `Setup New Reward:`.
- You can rename or move an existing reward by running the setup flow again with the same reward title.
- If you want to stop the setup flow before redeeming a reward, click `Stop Setup Reward`.

# Command Permissions

Supported permission values:
- `everyone`
- `mods`
- `subs`
- `vips`
- Twitch username, for example `someviewer`
- Twitch user id, for example `id=123456789`

Notes:
- The broadcaster can always use all commands.
- You can combine multiple values with commas, for example `mods, subs, someviewer, id=123456789`.

# Commands

### !song 
Sends the currently playing track and artist(s) to the chat.

<a id="sr"></a>
### !sr <song name | link> [link...]
Adds track(s) to the queue by name or link.

When track(s) is added, a Spotify notification will appear showing which user added the track and its title(s).

When searching by name, you can optionally include the artist to improve search results.

If a link is recognized but the track is not available on Spotify, the bot will attempt to find it by searching for the track name.

Multiple links can be sent in a single message (see examples below).

<details>
  <summary>Examples</summary>
  <ul>
    <li><kbd>!sr Billie Jean Michael Jackson</kbd>
    <li><kbd>!sr open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5</kbd>
    <li><kbd>!sr open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5 open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b</kbd>
    <li><kbd>!sr on.soundcloud.com/ZONK9VyLBrYxgMZbd4 youtu.be/JGwWNGJdvx8 music.youtube.com/watch?v=zABLecsR5UE</kbd>
  </ul>
</details>

### !srn <song name | link> [link...]
**Priority request** — adds track(s) to the **beginning** of the queue (they will play next).

Works exactly like the [!sr](#sr) command. Supports the same formats.

### !rr [artist link | playlist link | album link]
Adds one **randomly selected** track to the queue.

Without arguments, picks a random track from your **Liked Songs**.

With arguments, the bot uses the **first valid Spotify link** in the message and ignores the rest.

Supported link types:
- Artist
- Playlist
- Album

<details>
  <summary>Examples</summary>
  <ul>
    <li><kbd>!rr</kbd>
    <li><kbd>!rr https://open.spotify.com/artist/3UCbp6D1lvILlxRJT9LnFa</kbd>
    <li><kbd>!rr https://open.spotify.com/playlist/0yqUu8JKyRbEI2pUJFYkBB</kbd>
    <li><kbd>!rr https://open.spotify.com/album/42UJjk8i8L0De7lQtu7sqi</kbd>
  </ul>
</details>

### !rrn [artist link | playlist link | album link]
**Priority random request** — adds a randomly selected track to the **beginning** of the queue.

Works exactly like `!rr`, but inserts the selected track at the front.

### !rm [match by title or artist | index from the end of the queue]
Removes one of your previously requested tracks from the queue.

Without arguments, removes your most recently requested track.

You can provide an index (counting from the end of **your requests**) or remove a track by searching for part of its title or artist.

If you are the broadcaster or a moderator, you can remove **any track** by searching for part of its title or artist.

If `allowGlobalDeleteForMods` is disabled, only the broadcaster can remove any track from the full queue.

<details>
  <summary>Examples</summary>

<ul>
  <li><kbd>!rm</kbd> — Removes your most recently requested track.
  <li><kbd>!rm 2</kbd> — Removes your second-to-last requested track.
  <li><kbd>!rm Bill</kbd> — Removes your requested track containing <code>Bill</code> in the title or artist (e.g. <code>Billie Jean – Michael Jackson</code>).
  <li><kbd>!rm Jackson</kbd> — Removes the same track as in the previous example.
</ul>

</details>

### !clear
Clears the Spotify queue and the song request queue.

Command availability is configurable in permission settings.

### !prev
Switches Spotify playback to the previous track.

Available to moderators by default.

### !next
Switches Spotify playback to the next track.

Available to moderators by default.

### !volume [0-100 | +10 | -23%]
Shows the current Spotify volume.

If a value from `0` to `100` is provided, sets the Spotify volume to that percentage.
If the value starts with `+` or `-`, it adjusts the current volume by that amount.

Available to moderators by default.

# Development

### Watch Mode
1. Auto-rebuilding on code changes:
    ```bash
    pnpm watch
    ```
2. Run Spotify in watch mode:
    ```bash
    spicetify watch -le
    ```

### Build Distribution File

To build files locally and store them in a `dist` folder:

```bash
pnpm build:dist
```

### AutoBuild (CI/CD)
With each commit to the `main` branch, GitHub Action builds the extension and saves it to the `marketplace` branch.
