import { initNewBot } from "./bot";
import { addSettings } from "./config";

async function main() {
  await addSettings();
  await initNewBot();
}

export default main;
