/**
 * Fetches a CT client credentials access token for use as bearer auth
 * when calling the ACP connector service.
 */

interface CTTokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: CTTokenCache | null = null;

export async function getCTAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const authUrl = process.env.CTP_AUTH_URL;
  const clientId = process.env.CTP_CLIENT_ID;
  const clientSecret = process.env.CTP_CLIENT_SECRET;
  const projectKey = process.env.CTP_PROJECT_KEY;

  if (!authUrl || !clientId || !clientSecret || !projectKey) {
    throw new Error('Missing CT credentials in environment');
  }

  const response = await fetch(
    `${authUrl}/oauth/token?grant_type=client_credentials&scope=manage_project:${projectKey}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to obtain CT access token: ${response.status} ${text}`);
  }

  const data = await response.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return tokenCache.token;
}
