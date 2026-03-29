export interface FulfillmentOption {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  carrier_info: string;
  earliest_delivery_time: string;
  latest_delivery_time: string;
  subtotal: number;
  tax: number;
  total: number;
}

export function formatDeliveryWindow(earliest: string, latest: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${fmt(earliest)} – ${fmt(latest)}`;
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}
