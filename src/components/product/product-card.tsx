import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  ShoppingBag,
  Star,
  Tag,
} from 'lucide-react';

import { formatCurrency } from '@/lib/format';

export type ProductCardItem = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  sold?: number;
  rating?: number;
  category?: string;
  promoLabel?: string;
  stockQty?: number;
};

type ProductCardProps = {
  product: ProductCardItem;
  highlight?: boolean;
};

export function ProductCard({
  product,
  highlight = false,
}: ProductCardProps) {
  const isOutOfStock = (product.stockQty ?? 1) <= 0;

  return (
    <div
      className={`group overflow-hidden rounded-[28px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl ${
        highlight ? 'border-[#009A3E]/25' : 'border-[#E2E8F0]'
      }`}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#F1F5F9]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition duration-500 group-hover:scale-110 ${
              isOutOfStock ? 'grayscale' : ''
            }`}
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.promoLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#009A3E] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                <Tag size={11} />
                {product.promoLabel}
              </span>
            )}

            {isOutOfStock && (
              <span className="rounded-full bg-[#E60046] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                Habis
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        {product.category && (
          <Link href={`/category/${product.category.toLowerCase()}`}>
            <p className="text-xs font-black uppercase tracking-wide text-[#009A3E]">
              {product.category}
            </p>
          </Link>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[42px] text-sm font-black leading-5 text-[#1E293B] transition group-hover:text-[#009A3E] md:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3">
          <p className="text-lg font-black text-[#1E293B]">
            {formatCurrency(product.price)}
          </p>

          {product.originalPrice && product.originalPrice > product.price && (
            <p className="mt-1 text-xs font-bold text-[#94A3B8] line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-[#64748B]">
          <span className="flex items-center gap-1">
            <Star size={13} fill="currentColor" className="text-[#FACC15]" />
            {product.rating ?? 0}
          </span>

          <span>Terjual {product.sold ?? 0}</span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-[#E2E8F0] px-3 py-3 text-xs font-black text-[#1E293B] transition hover:bg-[#F8FAFC]"
          >
            Detail
            <ChevronRight size={14} />
          </Link>

          <Link
            href={isOutOfStock ? `/products/${product.slug}` : '/cart'}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition ${
              isOutOfStock
                ? 'bg-[#94A3B8]'
                : 'bg-[#009A3E] hover:scale-[1.04]'
            }`}
            aria-label="Tambah ke keranjang"
          >
            <ShoppingBag size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}