'use client';

import Image from 'next/image';
import type { DemoProduct } from '@/lib/seed-products';

interface Props {
  product: DemoProduct;
  onBuyNow: (product: DemoProduct) => void;
}

export function ProductCard({ product, onBuyNow }: Props) {
  return (
    <div className="group relative w-48 rounded-xl bg-gray-800 border border-gray-700 hover:border-yellow-400 transition-all overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-40 bg-gray-700 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          unoptimized
        />
        {product.isDemoData && (
          <span className="absolute top-1.5 left-1.5 bg-yellow-500 text-black text-[10px] font-semibold px-1.5 py-0.5 rounded z-10">
            DEMO DATA
          </span>
        )}

        {/* Hover overlay: description + SKU */}
        <div className="absolute inset-0 bg-gray-950/80 flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-[11px] text-gray-200 line-clamp-3 leading-snug mb-1.5">{product.description}</p>
          <span className="self-start bg-gray-700 text-gray-400 text-[10px] font-mono px-1.5 py-0.5 rounded">
            {product.sku}
          </span>
        </div>
      </div>

      {/* Name + price */}
      <div className="p-3 pb-2">
        <p className="text-xs font-medium text-gray-100 line-clamp-2 leading-snug">{product.name}</p>
        <p className="text-sm font-bold text-yellow-400 mt-1">{product.price}</p>
      </div>

      {/* Buy now button — always rendered, visible on hover */}
      <div className="px-3 pb-3">
        <button
          onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
          className="w-full bg-[#FFC82B] hover:bg-yellow-300 text-[#1a1a1a] font-bold text-sm py-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
