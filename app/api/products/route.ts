import { NextResponse } from 'next/server';
import { apiRoot } from '@/lib/ct/client';
import { SEED_PRODUCTS, type DemoProduct } from '@/lib/seed-products';

function formatPrice(centAmount: number): string {
  return `$${(centAmount / 100).toFixed(2)}`;
}

function getLocalized(obj: Record<string, string> | undefined): string {
  if (!obj) return '';
  return obj['en-GB'] ?? obj['en-US'] ?? obj['en'] ?? Object.values(obj)[0] ?? '';
}

export async function GET() {
  try {
    const { body } = await apiRoot
      .productProjections()
      .get({
        queryArgs: {
          limit: 20,
          priceCurrency: 'USD',
          priceCountry: 'US',
        },
      })
      .execute();

    const products: DemoProduct[] = body.results
      .map((p) => {
        const name = getLocalized(p.name);
        const description = getLocalized(p.description);
        const image = p.masterVariant.images?.[0]?.url ?? '';
        const price = p.masterVariant.prices?.[0]?.value;
        const priceStr = price ? formatPrice(price.centAmount) : '';

        if (!name || !priceStr) return null;

        return {
          id: p.id,
          name,
          description: description || `${name} — available at John Lewis`,
          price: priceStr,
          imageUrl: image || 'https://placehold.co/400x400/1e293b/94a3b8?text=Product',
          sku: p.masterVariant.sku ?? p.id,
          enable_checkout: true as boolean,
          enable_search: true as boolean,
        };
      })
      .filter((p): p is DemoProduct => p !== null);

    // Shuffle and pick 3-6
    const shuffled = products.sort(() => Math.random() - 0.5).slice(0, 10);

    if (shuffled.length < 3) {
      return NextResponse.json({ products: SEED_PRODUCTS, usedSeedData: true });
    }

    return NextResponse.json({ products: shuffled, usedSeedData: false });
  } catch (err) {
    console.error('Failed to fetch CT products, using seed data:', err);
    return NextResponse.json({ products: SEED_PRODUCTS, usedSeedData: true });
  }
}
