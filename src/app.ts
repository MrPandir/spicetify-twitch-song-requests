import { initNewBot, getAccessToken } from "./bot";
import { addSettings, getChannel } from "./config";
import { addAuthButton, authPromise } from "./ui";

async function main() {
  await addSettings();

  let accessToken = await getAccessToken();

  if (!accessToken) {
    addAuthButton();
    await authPromise;
    accessToken = await getAccessToken();
  }

  if (!accessToken) {
    console.error("Failed to get access token");
    Spicetify.showNotification("Failed to get access token", true);
  } else {
    await initNewBot(accessToken, getChannel());
  }
}

export default main;
