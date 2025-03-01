import { getDeviceCode, pollForAccessToken } from "@bot";
import type { DeviceCodeResponse } from "@bot/types";

let button: Spicetify.Topbar.Button;
let deviceCode: DeviceCodeResponse | undefined;
let authPromiseResolve: ((value: void) => void) | null = null;

export const authPromise = new Promise<void>((resolve) => {
  authPromiseResolve = resolve;
});

export function addAuthButton() {
  if (button) return;

  button = new Spicetify.Topbar.Button(
    "Twitch Bot Authorization",
    "external-link",
    auth,
    false,
    true,
  );
}

async function auth(button: Spicetify.Topbar.Button) {
  if (deviceCode) return;

  deviceCode = await getDeviceCode();

  console.log(
    `Please go to ${deviceCode.verification_uri} and enter the code: ${deviceCode.user_code}`,
  );
  window.open(deviceCode.verification_uri, "_blank");
  // TODO: Show notification with device code? Need to use Snackbar

  try {
    await pollForAccessToken(
      deviceCode.device_code,
      deviceCode.interval,
      deviceCode.expires_in,
    );
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "Polling timeout exceeded"
    ) {
      console.log("Polling timeout occurred");
      deviceCode = undefined;
      return;
    } else {
      console.error(`Authentication Error: ${error}`);
      return;
    }
  }

  button.element.remove();
  authPromiseResolve?.();
}
