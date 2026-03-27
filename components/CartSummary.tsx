'use client';

import Image from 'next/image';
import { type FulfillmentOption, formatCents, formatDeliveryWindow } from '@/lib/fulfillment';
import type { DemoProduct } from '@/lib/seed-products';

interface Props {
  product: DemoProduct;
  shippingOption: FulfillmentOption;
  onCheckout: () => void;
  loading?: boolean;
}

export function CartSummary({ product, shippingOption, onCheckout, loading = false }: Props) {
  // Parse product price string to cents for display, or use raw string if we can't
  const productPriceLabel = product.price;
  const shippingLabel = shippingOption.total === 0 ? 'Free' : formatCents(shippingOption.total);

  return (
    <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/80">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Order Summary</p>
      </div>

      {/* Product row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/60">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-700 shrink-0">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white line-clamp-2">{product.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">Qty: 1</p>
        </div>
        <p className="text-sm font-bold text-yellow-400 shrink-0">{productPriceLabel}</p>
      </div>

      {/* Shipping row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
        <div>
          <p className="text-xs text-gray-300 font-medium">{shippingOption.title}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {formatDeliveryWindow(shippingOption.earliest_delivery_time, shippingOption.latest_delivery_time)}
          </p>
        </div>
        <p className="text-sm font-semibold text-gray-300">{shippingLabel}</p>
      </div>

      {/* Totals */}
      <div className="px-4 py-3 space-y-1.5">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span>
          <span>{productPriceLabel}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Shipping</span>
          <span>{shippingLabel}</span>
        </div>
        {shippingOption.tax > 0 && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>Tax</span>
            <span>{formatCents(shippingOption.tax)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-700">
          <span>Total</span>
          <span className="text-yellow-400">{productPriceLabel} + {shippingLabel}</span>
        </div>
      </div>

      {/* Checkout button */}
      <div className="px-4 pb-4">
        <button
          onClick={onCheckout}
          disabled={loading}
          className="w-full bg-[#FFC82B] hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-[#1a1a1a] font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>🔒 Place Order</>
          )}
        </button>
      </div>
    </div>
  );
}
