import { getDeviceCode, pollForAccessToken } from "@bot";
import type { DeviceCodeResponse } from "@bot/types";

let button: Spicetify.Topbar.Button;
let deviceCode: DeviceCodeResponse | undefined;

let authResolvers: ((value: void) => void)[] = [];

function addAuthButton() {
  if (button && button.element.hidden) return (button.element.hidden = false);

  button = new Spicetify.Topbar.Button(
    "Twitch Bot Authorization",
    "external-link",
    handleAuthClick,
    false,
    true,
  );
}

export function createAuthPromise(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    authResolvers.push(resolve);
    addAuthButton();
  });
}

async function handleAuthClick(button: Spicetify.Topbar.Button) {
  console.debug("Authentication button clicked", button);

  if (!deviceCode) deviceCode = await getDeviceCode();
  // NOTE: deviceCode may become invalid after time

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
      return;
    } else {
      console.error("Authentication Error:", error);
      return;
    }
  }

  console.log("Authentication successful");
  deviceCode = undefined;
  button.element.hidden = true;
  authResolvers.forEach((resolve) => resolve());
  authResolvers = [];
}
