import { initNewBot, getAccessToken } from "@bot";
import { addSettings, getChannel } from "@config";
import { createAuthPromise } from "@ui";

async function main() {
  await addSettings();

  let accessToken = await getAccessToken();

  if (!accessToken) {
    console.log("No token. Adding auth button");
    await createAuthPromise();
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
