interface TwitchValidateSuccess {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
}

interface TwitchValidateError {
  status: number;
  message: string;
}

type TwitchValidateResponse = TwitchValidateSuccess | TwitchValidateError;
