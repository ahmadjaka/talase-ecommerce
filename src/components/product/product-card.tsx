'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  ShoppingCart,
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
  sellingPrice?: number;
  discountPrice?: number;
  finalPrice?: number;
  hasDiscount?: boolean;
  sold?: number;
  rating?: number;
  category?: string;
  categorySlug?: string;
  promoLabel?: string;
  stockQty?: number;
  stockEnabled?: boolean;
  isOutOfStock?: boolean;
  unit?: string;
  isFeatured?: boolean;
};

type ProductCardProps = {
  product: ProductCardItem;
  highlight?: boolean;
  primaryColor?: string;
  accentColor?: string;
  cardStyle?: string;
};

export function ProductCard({
  product,
  highlight = false,
  primaryColor = '#009A3E',
  accentColor = '#FF7A1A',
  cardStyle = 'rounded_card',
}: ProductCardProps) {
  const isOutOfStock =
    product.isOutOfStock === true ||
    (product.stockEnabled === true && (product.stockQty ?? 0) <= 0);

  const originalPrice = Number(
    product.originalPrice || product.sellingPrice || product.price || 0,
  );

  const discountPrice = Number(product.discountPrice || 0);

  const hasDiscount =
    discountPrice > 0 && discountPrice < originalPrice;

  const finalPrice = hasDiscount
    ? discountPrice
    : Number(product.finalPrice || product.price || originalPrice);

  const addToCart = () => {
    if (isOutOfStock) return;

    try {
      const raw = localStorage.getItem('talase_cart');
      const parsed = raw ? JSON.parse(raw) : [];
      const cart = Array.isArray(parsed) ? parsed : [];

      const existing = cart.find(
        (item: any) => item.slug === product.slug || item.id === product.id,
      );

      const maxQty = product.stockEnabled
        ? Math.max(product.stockQty ?? 1, 1)
        : 999;

      if (existing) {
        existing.qty = Math.min(Number(existing.qty || 1) + 1, maxQty);
        existing.price = finalPrice;
        existing.finalPrice = finalPrice;
        existing.originalPrice = originalPrice;
        existing.sellingPrice = originalPrice;
        existing.discountPrice = hasDiscount ? discountPrice : 0;
        existing.hasDiscount = hasDiscount;
      } else {
        cart.push({
          id: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.imageUrl,
          price: finalPrice,
          finalPrice,
          originalPrice,
          sellingPrice: originalPrice,
          discountPrice: hasDiscount ? discountPrice : 0,
          hasDiscount,
          stockQty: product.stockQty ?? 0,
          stockEnabled: product.stockEnabled === true,
          unit: product.unit || 'pcs',
          qty: 1,
          note: '',
        });
      }

      localStorage.setItem('talase_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('talase-cart-updated'));
      window.location.href = '/cart';
    } catch (_) {
      window.location.href = `/cart?add=${encodeURIComponent(product.slug)}`;
    }
  };

  const categorySlug =
    product.categorySlug ||
    product.category
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-') ||
    '';

  return (
    <div
      className={resolveProductCardClass(cardStyle)}
      style={{
        borderColor: highlight ? `${primaryColor}40` : '#E2E8F0',
      }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className={resolveProductImageClass(cardStyle)}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition duration-500 group-hover:scale-110 ${
              isOutOfStock ? 'grayscale' : ''
            }`}
          />

          <div className="absolute left-2 top-2 flex flex-wrap gap-2">
            {product.promoLabel && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                <Tag size={10} />
                {product.promoLabel}
              </span>
            )}

            {isOutOfStock && (
              <span className="rounded-full bg-[#E60046] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                Habis
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className={resolveProductBodyClass(cardStyle)}>
        {product.category && (
          <Link href={`/category/${categorySlug}`}>
            <p
              className="line-clamp-1 text-[10px] font-black uppercase tracking-wide md:text-[11px]"
              style={{ color: primaryColor }}
            >
              {product.category}
            </p>
          </Link>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1.5 line-clamp-2 min-h-[38px] text-[13px] font-black leading-[19px] text-[#102033] md:text-[15px] md:leading-5">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
          <p
            className="text-[15px] font-black md:text-lg"
            style={{ color: primaryColor }}
          >
            {formatCurrency(finalPrice)}
          </p>

          {hasDiscount && (
            <p className="pb-0.5 text-[11px] font-bold text-[#94A3B8] line-through md:text-xs">
              {formatCurrency(originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={addToCart}
            disabled={isOutOfStock}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-2 text-[11px] font-black text-white shadow-sm transition hover:scale-[1.01] disabled:cursor-not-allowed md:h-10 md:gap-2 md:rounded-2xl md:px-3 md:text-xs"
            style={{
              backgroundColor: isOutOfStock ? '#94A3B8' : primaryColor,
            }}
            aria-label={
              isOutOfStock
                ? 'Produk habis'
                : `Tambah ${product.name} ke keranjang`
            }
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? 'Habis' : 'Keranjang'}
          </button>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#102033] transition hover:bg-[#F8FAFC] md:h-10 md:w-10 md:rounded-2xl"
            aria-label={`Detail ${product.name}`}
          >
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function resolveProductCardClass(cardStyle: string) {
  const base =
    'group overflow-hidden border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl';

  if (cardStyle === 'minimal_card') {
    return `${base} rounded-2xl`;
  }

  if (cardStyle === 'image_focus_card') {
    return `${base} rounded-[24px] md:rounded-[28px]`;
  }

  if (cardStyle === 'compact_card') {
    return `${base} rounded-2xl`;
  }

  if (cardStyle === 'classic_card') {
    return `${base} rounded-xl`;
  }

  return `${base} rounded-[22px] md:rounded-[24px]`;
}

function resolveProductImageClass(cardStyle: string) {
  if (cardStyle === 'image_focus_card') {
    return 'relative aspect-[4/5] overflow-hidden bg-[#F1F5F9]';
  }

  if (cardStyle === 'compact_card') {
    return 'relative aspect-[1.12/1] overflow-hidden bg-[#F1F5F9] md:aspect-[1.2/1]';
  }

  if (cardStyle === 'classic_card') {
    return 'relative aspect-[1.08/1] overflow-hidden bg-[#F1F5F9] md:aspect-[1.15/1]';
  }

  return 'relative aspect-square overflow-hidden bg-[#F1F5F9]';
}

function resolveProductBodyClass(cardStyle: string) {
  if (cardStyle === 'compact_card') {
    return 'p-2.5 md:p-3';
  }

  if (cardStyle === 'classic_card') {
    return 'p-3 md:p-3.5';
  }

  return 'p-3 md:p-4';
}