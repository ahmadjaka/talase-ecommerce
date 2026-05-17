import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import { resolveSubdomain } from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

async function getStoreData(subdomain: string | null) {
  const cartItems = [
    {
      id: '1',
      slug: 'kopi-arabica-premium',
      name: 'Kopi Arabica Premium',
      imageUrl:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      price: 45000,
      qty: 2,
      note: 'Giling medium',
    },
    {
      id: '2',
      slug: 'paket-snack-umkm',
      name: 'Paket Snack UMKM',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      price: 25000,
      qty: 1,
      note: '',
    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const discount = 10000;
  const total = subtotal - discount;

  return {
    businessName: subdomain
      ? `${subdomain.toUpperCase()} Store`
      : 'Talase Store',
    businessType: 'Official Ecommerce Store',
    cartItems,
    subtotal,
    discount,
    total,
  };
}

export default async function CartPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStoreData(subdomain);

  return (
    <main className="min-h-screen bg-[#F6FAF7] text-[#1E293B]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-black text-[#009A3E]"
          >
            <ArrowLeft size={17} />
            Lanjut belanja
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Keranjang Belanja
              </h1>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Periksa produk pilihan Anda sebelum lanjut ke checkout.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E8F7EE] px-4 py-2 text-sm font-black text-[#009A3E]">
              <ShoppingBag size={17} />
              {store.cartItems.length} Item
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {store.cartItems.length > 0 ? (
            store.cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[30px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5"
              >
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

                      <span className="mx-5 text-sm font-black">
                        {item.qty}
                      </span>

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
            ))
          ) : (
            <div className="rounded-[30px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F1F5F9] text-[#94A3B8]">
                <ShoppingBag size={28} />
              </div>

              <h2 className="mt-5 text-xl font-black text-[#1E293B]">
                Keranjang masih kosong
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-[#64748B]">
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
        </div>

        <aside className="h-fit rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-black">Ringkasan Pesanan</h2>

          <div className="mt-6 space-y-4">
            <SummaryRow label="Subtotal" value={formatCurrency(store.subtotal)} />
            <SummaryRow label="Diskon" value={`- ${formatCurrency(store.discount)}`} />
            <div className="border-t border-dashed border-[#CBD5E1] pt-4">
              <SummaryRow
                label="Total"
                value={formatCurrency(store.total)}
                bold
              />
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

          <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4">
            <p className="text-xs font-black uppercase tracking-wide text-[#94A3B8]">
              Catatan
            </p>
            <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
              Ongkir dan metode pembayaran akan dipilih pada halaman checkout.
            </p>
          </div>
        </aside>
      </section>

      <StoreFooter businessName={store.businessName} />
    </main>
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