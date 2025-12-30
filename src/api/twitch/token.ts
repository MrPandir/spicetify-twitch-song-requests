export async function validateToken(
  accessToken: string,
): Promise<TwitchValidateResponse> {
  const response = await fetch("https://id.twitch.tv/oauth2/validate", {
    headers: { Authorization: `OAuth ${accessToken}` },
  });

  return await response.json();
}
