export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export interface TokenResponse {
  access_token: string;
  expires_in?: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

export interface TokenError {
  status: number;
  message: string;
}
