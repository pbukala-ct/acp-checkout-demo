interface TokenCache {
  token: string;
  generatedAt: number;
}

let cache: TokenCache | null = null;
let generationError: string | null = null;

export async function getStripeToken(): Promise<string> {
  if (cache) return cache.token;

  const key = process.env.STRIPE_TEST_KEY;
  if (!key) throw new Error('STRIPE_TEST_KEY is not configured');

  const response = await fetch('https://api.stripe.com/v1/test_helpers/shared_payment/granted_tokens', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      payment_method: 'pm_card_visa',
      'usage_limits[currency]': 'usd',
      'usage_limits[max_amount]': '150000',
      'usage_limits[expires_at]': '1775847620',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    generationError = `Stripe error ${response.status}: ${data.error?.message ?? JSON.stringify(data)}`;
    throw new Error(generationError);
  }

  cache = { token: data.id, generatedAt: Date.now() };
  generationError = null;
  return cache.token;
}

export function getTokenStatus(): { ready: boolean; token: string | null; error: string | null } {
  return { ready: !!cache, token: cache?.token ?? null, error: generationError };
}

export function clearTokenCache(): void {
  cache = null;
  generationError = null;
}
