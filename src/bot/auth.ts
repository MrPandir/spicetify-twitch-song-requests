import { setStorageItem, getStorageItem, removeStorageItem } from "@utils";
import { CLIENT_ID, SCOPES } from "@config";
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

function handleTokenError(error: TokenError): void {
  switch (error.message) {
    case "authorization_pending":
      break;
    case "invalid_device_code":
      throw new Error("Device code has expired or is invalid");
    default:
      console.error("Unexpected error during token request:", error);
      throw error;
  }
}

export async function pollForAccessToken(
  deviceCode: string,
  interval: number,
  timeout: number = 1800,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const tokenData = await requestAccessToken(deviceCode);

        saveTokens(
          tokenData.access_token,
          tokenData.refresh_token,
          tokenData.expires_in || 0,
        );
        clearInterval(pollInterval);
        resolve();
      } catch (error) {
        try {
          handleTokenError(error as TokenError);
        } catch (handledError) {
          clearInterval(pollInterval);
          reject(handledError);
        }
      }
    }, interval * 1000);

    setTimeout(() => {
      clearInterval(pollInterval);
      reject(new Error("Polling timeout exceeded"));
    }, timeout * 1000);
  });
}

export function saveTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): void {
  // const expirationDate = new Date(Date.now() + expiresIn * 1000).toISOString();
  setStorageItem("access_token", accessToken);
  // setStorageItem("refresh_token", refreshToken);
  // setStorageItem("token_expiration", expirationDate);
}

// export async function refreshToken(): Promise<void> {
//   const refreshToken = getStorageItem("refresh_token");
//   if (!refreshToken) {
//     throw new Error("No refresh token found");
//   }

//   const params = new URLSearchParams({
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET, // ???
//     grant_type: "refresh_token",
//     refresh_token: refreshToken,
//   });

//   const response = await fetch(`${TWITCH_TOKEN_URL}?${params}`, {
//     method: "POST",
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const data: TokenResponse = await response.json();
//   saveTokens(data.access_token, data.refresh_token, data.expires_in);
// }

export async function getAccessToken(): Promise<string | null> {
  const token = getStorageItem("access_token");
  // const expiration = getStorageItem("token_expiration");

  // if (!token || !expiration) {
  //   return null;
  // }

  // if (new Date(expiration) < new Date()) {
  //   return null;
  // }

  return token;
}
