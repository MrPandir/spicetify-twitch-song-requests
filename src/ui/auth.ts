import { validateToken } from "@api/twitch";
import {
  clearAccessToken,
  client,
  disconnect,
  getAccessToken,
  getDeviceCode,
  initNewBot,
  pollForAccessToken,
} from "@bot";
import type { DeviceCodeResponse } from "@bot/types";

let deviceCode: Promise<DeviceCodeResponse> | undefined;
let isPolling = false;
let rerenderAuthButton: (() => void) | undefined;

export function getAuthButtonText() {
  return getAccessToken() ? "Logout" : "Login";
}

export function registerAuthButtonRerender(callback: () => void) {
  rerenderAuthButton = callback;
}

export function refreshAuthButton() {
  rerenderAuthButton?.();
}

async function setupChannel(
  accessToken: string,
  getChannel: () => string,
  setChannel: (channel: string) => void,
) {
  if (getChannel()) return;

  const response = await validateToken(accessToken);

  if (!("login" in response)) return;

  setChannel(response.login);
}

async function login(
  getChannel: () => string,
  setChannel: (channel: string) => void,
) {
  console.debug("Authentication button clicked");

  if (!deviceCode) {
    deviceCode = getDeviceCode();
  }
  const pendingCode = await deviceCode;

  console.log(
    `Please go to ${pendingCode.verification_uri} and enter the code: ${pendingCode.user_code}`,
  );
  window.open(pendingCode.verification_uri, "_blank");
  // TODO: Show notification with device code? Need to use Snackbar

  if (isPolling) return;
  isPolling = true;

  try {
    await pollForAccessToken(
      pendingCode.device_code,
      pendingCode.interval,
      pendingCode.expires_in,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Polling timeout exceeded") {
        deviceCode = undefined;
        isPolling = false;
        console.log("Polling timeout occurred");
        return;
      }

      if (error.message === "Device code has expired or is invalid") {
        deviceCode = undefined;
      }
    }

    isPolling = false;
    console.error("Authentication Error:", error);
    return;
  }

  const accessToken = getAccessToken();

  if (!accessToken) {
    isPolling = false;
    Spicetify.showNotification("Failed to get access token", true);
    return;
  }

  console.log("Authentication successful");
  deviceCode = undefined;
  isPolling = false;

  await setupChannel(accessToken, getChannel, setChannel);
  refreshAuthButton();
  await initNewBot(accessToken, getChannel());
}

async function logout() {
  clearAccessToken();
  deviceCode = undefined;
  refreshAuthButton();

  if (client?.isConnected()) {
    await disconnect();
  }

  Spicetify.showNotification("Token removed");
}

export async function handleAuthButtonClick(
  getChannel: () => string,
  setChannel: (channel: string) => void,
) {
  if (getAccessToken()) {
    await logout();
    return;
  }

  await login(getChannel, setChannel);
}
