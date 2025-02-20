import { new_bot_client } from "./bot";
import { addSettings } from "./settings";

async function main() {
  await addSettings();
  await new_bot_client();
}

export default main;
