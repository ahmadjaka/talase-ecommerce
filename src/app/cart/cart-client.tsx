'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

type Product = {
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
  stockQty: number;
  stockEnabled: boolean;
  isOutOfStock: boolean;
  unit: string;
};

type CartItem = Product & {
  qty: number;
  note: string;
};

const CART_KEY = 'talase_cart';
function normalizeCartPrice(item: any) {
  const originalPrice = Number(
    item.originalPrice || item.sellingPrice || item.price || 0,
  );

  const discountPrice = Number(item.discountPrice || 0);

  const hasDiscount =
    discountPrice > 0 && discountPrice < originalPrice;

  const finalPrice = hasDiscount
    ? discountPrice
    : Number(item.finalPrice || item.price || originalPrice);

  return {
    originalPrice,
    discountPrice: hasDiscount ? discountPrice : 0,
    finalPrice,
    price: finalPrice,
    hasDiscount,
  };
}

export function CartClient({
  products,
  primaryColor,
}: {
  products: Product[];
  primaryColor: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addSlug = params.get('add');

    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    let cart: CartItem[] = Array.isArray(parsed) ? parsed : [];

    if (addSlug) {
      const product = products.find((p) => p.slug === addSlug);

      if (product && !product.isOutOfStock) {
        const existing = cart.find((item) => item.slug === product.slug);

        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({
            ...product,
            ...normalizeCartPrice(product),
            qty: 1,
            note: '',
          });
        }
      }

      window.history.replaceState({}, '', '/cart');
    }

    cart = cart
      .map((item) => ({
        ...item,
        ...normalizeCartPrice(item),
      }))
      .filter((item) => item.slug && item.price > 0);

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('talase-cart-updated'));

    setItems(cart);
  }, [products]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => {
      const price = Number(item.originalPrice || item.sellingPrice || item.price || 0);
      return sum + price * item.qty;
    }, 0),
    [items],
  );

  const productDiscountTotal = useMemo(
    () => items.reduce((sum, item) => {
      const originalPrice = Number(item.originalPrice || item.sellingPrice || item.price || 0);
      const finalPrice = Number(item.price || item.finalPrice || originalPrice);
      return sum + Math.max(0, originalPrice - finalPrice) * item.qty;
    }, 0),
    [items],
  );

  const total = Math.max(0, subtotal - productDiscountTotal);

  function save(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('talase-cart-updated'));
  }

  function changeQty(slug: string, delta: number) {
    save(
      items.map((item) =>
        item.slug === slug
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item,
      ),
    );
  }

  function remove(slug: string) {
    save(items.filter((item) => item.slug !== slug));
  }

  return (
    <>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F1F5F9] text-[#94A3B8]">
              <ShoppingBag size={28} />
            </div>

            <h2 className="mt-5 text-xl font-black text-[#102033]">
              Keranjang masih kosong
            </h2>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-2xl px-6 py-4 text-sm font-black text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Lihat Produk
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.slug}
              className="rounded-[30px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5"
            >
              <div className="grid gap-4 md:grid-cols-[130px_1fr_auto] md:items-center">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative aspect-square overflow-hidden rounded-[24px] bg-[#F1F5F9]"
                >
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </Link>

                <div>
                  <h2 className="text-lg font-black text-[#102033] md:text-xl">
                    {item.name}
                  </h2>
                  <div className="mt-2">
                    <p className="text-xl font-black" style={{ color: primaryColor }}>
                      {formatCurrency(item.price)}
                    </p>

                    {item.hasDiscount && (
                      <p className="text-xs font-bold text-[#94A3B8] line-through">
                        {formatCurrency(item.originalPrice || item.sellingPrice || 0)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                  <div className="inline-flex h-12 items-center rounded-2xl border border-[#E2E8F0] bg-white px-3">
                    <button onClick={() => changeQty(item.slug, -1)}>
                      <Minus size={15} />
                    </button>
                    <span className="mx-5 text-sm font-black">{item.qty}</span>
                    <button onClick={() => changeQty(item.slug, 1)}>
                      <Plus size={15} />
                    </button>
                  </div>

                  <p className="text-lg font-black text-[#102033]">
                    {formatCurrency(item.price * item.qty)}
                  </p>

                  <button
                    onClick={() => remove(item.slug)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1F1] text-[#E60046]"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <aside className="h-fit rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
        <h2 className="text-2xl font-black">Ringkasan Pesanan</h2>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <p className="font-bold text-[#64748B]">Subtotal</p>
            <p className="font-black">{formatCurrency(subtotal)}</p>
          </div>

          {productDiscountTotal > 0 && (
            <div className="flex justify-between">
              <p className="font-bold text-[#64748B]">Diskon</p>
              <p className="font-black text-[#16A34A]">
                - {formatCurrency(productDiscountTotal)}
              </p>
            </div>
          )}

          <div className="border-t border-dashed border-[#CBD5E1] pt-4 flex justify-between">
            <p className="font-black">Total</p>
            <p className="text-2xl font-black" style={{ color: primaryColor }}>
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Lanjut Checkout
          <ArrowRight size={18} />
        </Link>
      </aside>
    </>
  );
}