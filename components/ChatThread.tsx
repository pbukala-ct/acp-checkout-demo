'use client';

import { useEffect, useRef } from 'react';
import { AgentMessage } from './AgentMessage';
import { ProductCard } from './ProductCard';
import { AddressForm, type AddressData } from './AddressForm';
import { OrderConfirmation } from './OrderConfirmation';
import type { DemoProduct } from '@/lib/seed-products';

export type ChatMessageType =
  | { id: string; role: 'agent'; content: string; typing?: boolean }
  | { id: string; role: 'user'; content: string }
  | { id: string; role: 'products'; products: DemoProduct[] }
  | { id: string; role: 'address-form' }
  | { id: string; role: 'confirmation'; sessionId: string; productName: string };

interface Props {
  messages: ChatMessageType[];
  onProductSelect: (product: DemoProduct) => void;
  onAddressSubmit: (data: AddressData) => void;
  formActive: boolean;
}

export function ChatThread({ messages, onProductSelect, onAddressSubmit, formActive }: Props) {
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
          return (
            <div key={msg.id} className="flex gap-3 flex-wrap">
              {msg.products.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={onProductSelect} />
              ))}
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
