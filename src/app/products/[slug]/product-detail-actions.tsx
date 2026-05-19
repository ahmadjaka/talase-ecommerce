'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Share2, ShoppingBag } from 'lucide-react';

type ProductActionItem = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  stockQty: number;
  stockEnabled: boolean;
  isOutOfStock: boolean;
  unit: string;
};

type ProductDetailActionsProps = {
  product: ProductActionItem;
  storeName: string;
  formattedPrice: string;
  primaryColor: string;
};

export function ProductDetailActions({
  product,
  storeName,
  formattedPrice,
  primaryColor,
}: ProductDetailActionsProps) {
  const [qty, setQty] = useState(1);

  const isOutOfStock = product.isOutOfStock;

  const decreaseQty = () => {
    setQty((value) => Math.max(value - 1, 1));
  };

  const increaseQty = () => {
    setQty((value) => {
      const maxQty = product.stockEnabled ? Math.max(product.stockQty, 1) : 999;
      return Math.min(value + 1, maxQty);
    });
  };

  const addToCart = () => {
    if (isOutOfStock) return;

    try {
      const raw = localStorage.getItem('talase_cart');
      const parsed = raw ? JSON.parse(raw) : [];
      const cart = Array.isArray(parsed) ? parsed : [];

      const existing = cart.find(
        (item: any) => item.slug === product.slug || item.id === product.id,
      );

      const maxQty = product.stockEnabled ? Math.max(product.stockQty, 1) : 999;

      if (existing) {
        existing.qty = Math.min(Number(existing.qty || 1) + qty, maxQty);
      } else {
        cart.push({
          id: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          stockQty: product.stockQty,
          stockEnabled: product.stockEnabled,
          unit: product.unit,
          qty: Math.min(qty, maxQty),
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

  const shareProduct = async () => {
    const url = window.location.href;

    const text =
      `${product.name}\n` +
      `${formattedPrice}\n\n` +
      `Cek produk ini di ${storeName}:\n` +
      url;

    try {
      localStorage.setItem(
        'talase_last_shared_product',
        JSON.stringify({
          title: product.name,
          price: formattedPrice,
          store: storeName,
          url,
          text,
          sharedAt: new Date().toISOString(),
        }),
      );

      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(text);
      alert('Link produk berhasil disalin.');
    } catch (_) {
      alert('Gagal membagikan produk.');
    }
  };

  return (
    <>
      <div className="mt-7 grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="inline-flex h-14 items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white px-4">
          <button
            type="button"
            onClick={decreaseQty}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B]"
          >
            <Minus size={16} />
          </button>

          <span className="mx-5 min-w-[18px] text-center text-sm font-black">
            {qty}
          </span>

          <button
            type="button"
            onClick={increaseQty}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={addToCart}
          disabled={isOutOfStock}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-xl transition hover:scale-[1.01] disabled:cursor-not-allowed"
          style={{
            backgroundColor: isOutOfStock ? '#94A3B8' : primaryColor,
          }}
        >
          <ShoppingBag size={18} />
          {isOutOfStock ? 'Produk Habis' : 'Tambah ke Keranjang'}
        </button>
      </div>

      <button
        type="button"
        onClick={shareProduct}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#102033] transition hover:bg-[#F8FAFC]"
      >
        <Share2 size={18} />
        Bagikan Produk
      </button>
    </>
  );
}