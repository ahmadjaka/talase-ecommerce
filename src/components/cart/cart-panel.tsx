import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

import { formatCurrency } from '@/lib/format';

export type CartPanelItem = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  qty: number;
  note?: string;
};

type CartPanelProps = {
  items: CartPanelItem[];
  discount?: number;
  shippingCost?: number;
};

export function CartPanel({
  items,
  discount = 0,
  shippingCost = 0,
}: CartPanelProps) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const total = subtotal - discount + shippingCost;

  return (
    <aside className="h-fit rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
      <h2 className="text-2xl font-black">Ringkasan Pesanan</h2>

      {items.length > 0 ? (
        <>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <CartMiniItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />

            {discount > 0 && (
              <SummaryRow
                label="Diskon"
                value={`- ${formatCurrency(discount)}`}
              />
            )}

            <SummaryRow
              label="Ongkir"
              value={
                shippingCost > 0 ? formatCurrency(shippingCost) : 'Diatur toko'
              }
            />

            <div className="border-t border-dashed border-[#CBD5E1] pt-4">
              <SummaryRow label="Total" value={formatCurrency(total)} bold />
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-xl transition hover:scale-[1.01]"
          >
            Lanjut Checkout
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/products"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#1E293B] transition hover:bg-[#F8FAFC]"
          >
            Tambah Produk Lain
          </Link>
        </>
      ) : (
        <div className="mt-6 rounded-[28px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#94A3B8] shadow-sm">
            <ShoppingBag size={28} />
          </div>

          <h3 className="mt-5 text-xl font-black text-[#1E293B]">
            Keranjang kosong
          </h3>

          <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
            Pilih produk dari katalog toko untuk mulai membuat pesanan.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-lg"
          >
            Lihat Produk
            <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </aside>
  );
}

function CartMiniItem({ item }: { item: CartPanelItem }) {
  return (
    <div className="grid grid-cols-[58px_1fr_auto] gap-3 rounded-2xl bg-[#F8FAFC] p-3">
      <Link
        href={`/products/${item.slug}`}
        className="relative aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]"
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </Link>

      <div>
        <Link href={`/products/${item.slug}`}>
          <h3 className="line-clamp-2 text-sm font-black text-[#1E293B] transition hover:text-[#009A3E]">
            {item.name}
          </h3>
        </Link>

        <p className="mt-1 text-xs font-bold text-[#64748B]">
          {item.qty} x {formatCurrency(item.price)}
        </p>

        {item.note && (
          <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#94A3B8]">
            {item.note}
          </p>
        )}
      </div>

      <p className="text-right text-sm font-black text-[#1E293B]">
        {formatCurrency(item.price * item.qty)}
      </p>
    </div>
  );
}

export function CartItemRow({ item }: { item: CartPanelItem }) {
  return (
    <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5">
      <div className="grid gap-4 md:grid-cols-[130px_1fr_auto] md:items-center">
        <Link
          href={`/products/${item.slug}`}
          className="relative aspect-square overflow-hidden rounded-[24px] bg-[#F1F5F9]"
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        </Link>

        <div>
          <Link href={`/products/${item.slug}`}>
            <h2 className="text-lg font-black text-[#1E293B] transition hover:text-[#009A3E] md:text-xl">
              {item.name}
            </h2>
          </Link>

          <p className="mt-2 text-xl font-black text-[#009A3E]">
            {formatCurrency(item.price)}
          </p>

          <div className="mt-4 rounded-2xl bg-[#F8FAFC] px-4 py-3">
            <p className="text-xs font-black uppercase tracking-wide text-[#94A3B8]">
              Catatan Item
            </p>

            <p className="mt-1 text-sm font-semibold text-[#64748B]">
              {item.note || 'Tidak ada catatan'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
          <div className="inline-flex h-12 items-center rounded-2xl border border-[#E2E8F0] bg-white px-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B]">
              <Minus size={15} />
            </button>

            <span className="mx-5 text-sm font-black">{item.qty}</span>

            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F7EE] text-[#009A3E]">
              <Plus size={15} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-[#94A3B8]">
              Subtotal
            </p>

            <p className="mt-1 text-lg font-black text-[#1E293B]">
              {formatCurrency(item.price * item.qty)}
            </p>
          </div>

          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1F1] text-[#E60046] transition hover:scale-[1.04]">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p
        className={
          bold
            ? 'text-base font-black text-[#1E293B]'
            : 'text-sm font-bold text-[#64748B]'
        }
      >
        {label}
      </p>

      <p
        className={
          bold
            ? 'text-2xl font-black text-[#009A3E]'
            : 'text-sm font-black text-[#1E293B]'
        }
      >
        {value}
      </p>
    </div>
  );
}