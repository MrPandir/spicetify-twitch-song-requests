# 🤖 Spicetify Twitch Song Requests
Twitch chat song requests for Spicetify — let viewers queue tracks using chat commands. No Spotify Premium subscription required.

# 📥 Installation

> [!IMPORTANT]
> [Spotify](https://www.spotify.com/) with [Spicetify](https://spicetify.app/) is required.

## 🛒 Via Marketplace (Recommended)
1. Install Marketplace: [Installation manual](https://spicetify.app/docs/customization/marketplace)
2. Open Marketplace, go to the `Extensions` tab, and search for `Twitch Song Requests`.
> [!IMPORTANT]
> If you don't see the extension, you probably need to click `Load more`.
3. Install the extension.
4. Next steps: [Authorization and Configuration](authorization-and-configuration)

## ✍️ Manual Installation
> [!NOTE]
> Using this installation method, you will **not** receive automatic updates.

1. Download [`dist/twitch-song-requests.js`](dist/twitch-song-requests.js) file.
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
5. Next steps: [Authorization and Configuration](authorization-and-configuration)

## 💻 Download Repository and Build
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
4. Next steps: [Authorization and Configuration](authorization-and-configuration)

# 🔑 Authorization and ⚙️ Configuration

1. Click on the bot authorization button in the upper right corner.
> [!TIP]
> Log in with a separate Twitch account if you want the bot to send messages as **a dedicated bot** instead of **your own account**.
> Make sure to assign VIP or Moderator status to avoid message limits.
2. This will open a tab in your browser. Click `Activate` and then `Authorize`.
3. Go to Spotify settings (account icon -> settings).
4. Scroll down to the bottom to find the `Twitch Song Requests` section.
5. Configure and enjoy.

# 💬 Commands

### !song 
Sends the currently playing track and artist(s) to the chat.

### !sr <song name | link> [link...]
Adds a track to the queue by name or link.

When a track is added, a Spotify notification will appear showing which user added the track and its title.

When searching by name, you can optionally include the artist to improve search results.

If a link is recognized but the track is not available on Spotify, the bot will attempt to find it by searching for the track name.

Multiple links can be sent in a single message (see examples below).

Supported link sources include:
Spotify, Apple Music, YouTube, YouTube Music, Pandora, Deezer, SoundCloud, Amazon Music, TIDAL, Audiomack, Boomplay, Anghami, Yandex.

<details>
  <summary>Examples</summary>
  <ul>
    <li><kbd>!sr Billie Jean Michael Jackson</kbd>
    <li><kbd>!sr open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5</kbd>
    <li><kbd>!sr open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5 open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b</kbd>
    <li><kbd>!sr on.soundcloud.com/ZONK9VyLBrYxgMZbd4 youtu.be/JGwWNGJdvx8 music.youtube.com/watch?v=zABLecsR5UE</kbd>
  </ul>
</details>

### !rm [name or index from the end]
Removes one of your previously requested tracks from the queue.

Without arguments, removes your most recently requested track.

You can provide an index (counting from the end of **your requests**) or remove a track by searching for part of its title or artist.

<details>
  <summary>Examples</summary>

<ul>
  <li><kbd>!rm</kbd> — Removes your most recently requested track.
  <li><kbd>!rm 2</kbd> — Removes your second-to-last requested track.
  <li><kbd>!rm Bill</kbd> — Removes your requested track containing <code>Bill</code> in the title or artist (e.g. <code>Billie Jean – Michael Jackson</code>).
  <li><kbd>!rm Jackson</kbd> — Removes the same track as in the previous example.
</ul>

</details>


# 🛠️ Development

### 👀 Watch Mode
1. Auto-rebuilding on code changes:
    ```bash
    pnpm watch
    ```
2. Run Spotify in watch mode:
    ```bash
    spicetify watch -le
    ```

### 📦 Build Distribution File

To build files locally and store them in a `dist` folder:

```bash
pnpm build:dist
```
