import { CLIENT_ID, SCOPES } from "@config";
import { settings } from "@ui/settings";
import type { DeviceCodeResponse, TokenResponse, TokenError } from "./types";

const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/device";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";

export async function getDeviceCode(): Promise<DeviceCodeResponse> {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scopes: SCOPES,
  });

  const response = await fetch(`${TWITCH_AUTH_URL}?${params}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function requestAccessToken(deviceCode: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    device_code: deviceCode,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
  });

  const response = await fetch(`${TWITCH_TOKEN_URL}?${params}`, {
    method: "POST",
  });

  const data: TokenResponse | TokenError = await response.json();

  if (!response.ok) {
    throw data as TokenError;
  }

  return data as TokenResponse;
}

type PollAction =
  | { status: "done" }
  | { status: "retry" }
  | { status: "slow_down" }
  | { status: "error"; error: Error };

function poll(
  fn: () => Promise<PollAction>,
  options: { interval: number; timeout: number },
): Promise<void> {
  return new Promise((resolve, reject) => {
    let currentInterval = options.interval;
    let pollInterval: ReturnType<typeof setInterval>;
    const startTime = Date.now();

    function startPolling() {
      pollInterval = setInterval(async () => {
        if (Date.now() - startTime > options.timeout * 1000) {
          clearInterval(pollInterval);
          reject(new Error("Polling timeout exceeded"));
          return;
        }

        const result = await fn();

        if (result.status === "done") {
          clearInterval(pollInterval);
          resolve();
          return;
        }

        if (result.status === "slow_down") {
          currentInterval += 5;
          console.debug(`slow_down: interval increased to ${currentInterval}s`);
          clearInterval(pollInterval);
          startPolling();
          return;
        }

        if (result.status === "error") {
          clearInterval(pollInterval);
          reject(result.error);
          return;
        }
      }, currentInterval * 1000);
    }

    startPolling();
  });
}

export async function pollForAccessToken(
  deviceCode: string,
  interval: number,
  timeout: number = 1800,
): Promise<void> {
  await poll(async () => {
    try {
      const tokenData = await requestAccessToken(deviceCode);
      saveTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in || 0);
      return { status: "done" };
    } catch (error) {
      const msg = (error as TokenError).message;

      if (msg === "slow_down") return { status: "slow_down" };
      if (msg === "authorization_pending") return { status: "retry" };
      if (msg === "invalid device code") return { status: "error", error: new Error("Device code has expired or is invalid") };

      console.error("Unexpected error during token request:", error);
      return { status: "error", error: error as Error };
    }
  }, { interval, timeout });
}

export function saveTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): void {
  settings.setFieldValue("access_token", accessToken);
}

export function getAccessToken(): string | null {
  return settings.getFieldValue("access_token");
}

export function clearAccessToken() {
  settings.setFieldValue("access_token", null);
}
