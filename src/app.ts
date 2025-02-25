import { initNewBot } from "./bot";
import { addSettings } from "./config";
import { getAccessToken } from "./bot/auth";
import { addAuthButton, authPromise } from "./ui";
import { settings } from "./config";

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
    await initNewBot(accessToken, settings.getFieldValue("channel"));
  }
}

export default main;
