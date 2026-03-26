'use client';

import Image from 'next/image';
import type { DemoProduct } from '@/lib/seed-products';

interface Props {
  product: DemoProduct;
  onSelect: (product: DemoProduct) => void;
}

export function ProductCard({ product, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="group w-44 rounded-xl bg-gray-800 border border-gray-700 hover:border-yellow-400 hover:bg-gray-750 transition-all text-left overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      <div className="relative w-full h-36 bg-gray-700 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          unoptimized
        />
        {product.isDemoData && (
          <span className="absolute top-1.5 left-1.5 bg-yellow-500 text-black text-[10px] font-semibold px-1.5 py-0.5 rounded">
            DEMO DATA
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-gray-100 line-clamp-2 leading-snug">{product.name}</p>
        <p className="text-sm font-bold text-yellow-400 mt-1">{product.price}</p>
      </div>
    </button>
  );
}
