import { validateToken } from "@api/twitch";
import { initNewBot, getAccessToken } from "@bot";
import { addSettings, getChannel, settings } from "@config";
import { createAuthPromise } from "@ui";

async function setupChannel(accessToken: string | null) {
  // No token or nickname already set
  if (!accessToken || getChannel()) return;

  const response = await validateToken(accessToken);

  if (!("login" in response)) return;

  settings.setFieldValue("channel", response.login);
  settings.rerender();
}

async function main() {
  await addSettings();

  let accessToken = getAccessToken();

  if (!accessToken) {
    console.log("No token. Adding auth button");
    await createAuthPromise();
    accessToken = getAccessToken();
    await setupChannel(accessToken);
  }

  if (!accessToken) {
    console.error("Failed to get access token");
    Spicetify.showNotification("Failed to get access token", true);
  } else {
    await initNewBot(accessToken, getChannel());
  }
}

export default main;
