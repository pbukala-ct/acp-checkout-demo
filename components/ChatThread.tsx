'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AgentMessage } from './AgentMessage';
import { ProductCard } from './ProductCard';
import { AddressForm, type AddressData } from './AddressForm';
import { OrderConfirmation } from './OrderConfirmation';
import { ShippingOptions } from './ShippingOptions';
import { CartSummary } from './CartSummary';
import type { DemoProduct } from '@/lib/seed-products';
import type { FulfillmentOption } from '@/lib/fulfillment';

export type ChatMessageType =
  | { id: string; role: 'agent'; content: string; typing?: boolean }
  | { id: string; role: 'user'; content: string }
  | { id: string; role: 'products'; products: DemoProduct[] }
  | { id: string; role: 'product-detail'; product: DemoProduct }
  | { id: string; role: 'address-form' }
  | { id: string; role: 'shipping-options'; options: FulfillmentOption[] }
  | { id: string; role: 'cart-summary'; product: DemoProduct; shippingOption: FulfillmentOption }
  | { id: string; role: 'confirmation'; sessionId: string; productName: string };

interface Props {
  messages: ChatMessageType[];
  onBuyNow: (product: DemoProduct) => void;
  onAddressSubmit: (data: AddressData) => void;
  onShippingSelect: (option: FulfillmentOption) => void;
  onCheckout: () => void;
  formActive: boolean;
  checkoutLoading: boolean;
  isBrowsing: boolean;
  filterCheckout: boolean;
  filterSearch: boolean;
  onFilterCheckoutChange: (v: boolean) => void;
  onFilterSearchChange: (v: boolean) => void;
}

export function ChatThread({
  messages,
  onBuyNow,
  onAddressSubmit,
  onShippingSelect,
  onCheckout,
  formActive,
  checkoutLoading,
  isBrowsing,
  filterCheckout,
  filterSearch,
  onFilterCheckoutChange,
  onFilterSearchChange,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => {
        if (msg.role === 'agent') {
          return (
            <div key={msg.id}>
              <AgentMessage content={msg.content} typing={msg.typing} />
            </div>
          );
        }

        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-[#FFC82B] text-[#1a1a1a] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-xs font-medium">
                {msg.content}
              </div>
            </div>
          );
        }

        if (msg.role === 'products') {
          const filtered = msg.products.filter((p) => {
            if (filterCheckout && !p.enable_checkout) return false;
            if (filterSearch && !p.enable_search) return false;
            return true;
          });
          return (
            <div key={msg.id}>
              {isBrowsing && (
                <div className="flex items-center gap-4 mb-3 px-1 py-2 rounded-lg bg-gray-900 border border-gray-700">
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide pl-1">Filter</span>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterCheckout}
                      onChange={(e) => onFilterCheckoutChange(e.target.checked)}
                      className="accent-[#FFC82B] w-3.5 h-3.5"
                    />
                    <span className="text-xs text-gray-300">Checkout enabled</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterSearch}
                      onChange={(e) => onFilterSearchChange(e.target.checked)}
                      className="accent-[#FFC82B] w-3.5 h-3.5"
                    />
                    <span className="text-xs text-gray-300">Search enabled</span>
                  </label>
                </div>
              )}
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center py-8 px-4 rounded-xl border border-dashed border-gray-700 text-gray-500 text-sm">
                  No products match the selected filters
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onBuyNow={onBuyNow} />
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (msg.role === 'product-detail') {
          const p = msg.product;
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tr-sm overflow-hidden w-64">
                <div className="relative w-full h-36 bg-gray-700">
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" unoptimized />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-100 line-clamp-2 leading-snug">{p.name}</p>
                  <p className="text-sm font-bold text-yellow-400 mt-1">{p.price}</p>
                  <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-snug">{p.description}</p>
                  <span className="inline-block mt-2 bg-gray-700 text-gray-400 text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {p.sku}
                  </span>
                </div>
              </div>
            </div>
          );
        }

        if (msg.role === 'address-form') {
          return (
            <div key={msg.id}>
              {formActive && <AddressForm onSubmit={onAddressSubmit} />}
            </div>
          );
        }

        if (msg.role === 'shipping-options') {
          return (
            <div key={msg.id}>
              <ShippingOptions options={msg.options} onSelect={onShippingSelect} />
            </div>
          );
        }

        if (msg.role === 'cart-summary') {
          return (
            <div key={msg.id}>
              <CartSummary
                product={msg.product}
                shippingOption={msg.shippingOption}
                onCheckout={onCheckout}
                loading={checkoutLoading}
              />
            </div>
          );
        }

        if (msg.role === 'confirmation') {
          return (
            <div key={msg.id}>
              <OrderConfirmation sessionId={msg.sessionId} productName={msg.productName} />
            </div>
          );
        }

        return null;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
