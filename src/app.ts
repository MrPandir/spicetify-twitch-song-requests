import { initNewBot, getAccessToken } from "@bot";
import { addSettings, getChannel } from "@ui/settings";

async function main() {
  await addSettings();

  const accessToken = getAccessToken();

  if (!accessToken) {
    console.log("No token. Use Login in settings to authorize the bot.");
    return;
  }

  await initNewBot(accessToken, getChannel());
}

export default main;
