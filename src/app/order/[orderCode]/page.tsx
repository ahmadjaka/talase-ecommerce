import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ReceiptText,
  ShoppingBag,
  User,
  XCircle,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import { resolveSubdomain } from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

async function getStoreData(subdomain: string | null, orderCode: string) {
  const items = [
    {
      id: '1',
      slug: 'kopi-arabica-premium',
      name: 'Kopi Arabica Premium',
      imageUrl:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      price: 45000,
      qty: 2,
    },
    {
      id: '2',
      slug: 'paket-snack-umkm',
      name: 'Paket Snack UMKM',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      price: 25000,
      qty: 1,
    },
  ];

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const discount = 10000;
  const shippingCost = 0;
  const total = subtotal - discount + shippingCost;

  return {
    businessName: subdomain
      ? `${subdomain.toUpperCase()} Store`
      : 'Talase Store',
    businessType: 'Official Ecommerce Store',
    order: {
      orderCode,
      customerName: 'Budi Santoso',
      customerPhone: '081234567890',
      customerAddress: 'Jl. Merdeka No. 10, Kecamatan, Kabupaten',
      customerNote: 'Tolong dikemas rapi.',
      orderStatus: 'processing',
      paymentStatus: 'waiting_confirmation',
      paymentMethod: 'transfer',
      createdAt: '17 Mei 2026, 12:30 WIB',
      subtotal,
      discount,
      shippingCost,
      total,
      items,
    },
  };
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  const { orderCode } = await params;
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStoreData(subdomain, orderCode);
  const order = store.order;

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
            Kembali ke toko
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Tracking Order
              </h1>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Pantau status pesanan Anda secara mudah tanpa login.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E8F7EE] px-4 py-2 text-sm font-black text-[#009A3E]">
              <ReceiptText size={17} />
              {order.orderCode}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-white shadow-sm">
            <div className="bg-gradient-to-br from-[#009A3E] via-[#007A32] to-[#0B4F8A] p-6 text-white md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide backdrop-blur-md">
                <PackageCheck size={15} />
                Status Pesanan
              </div>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Pesanan Sedang Diproses
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/85 md:text-base">
                Toko sedang menyiapkan pesanan Anda. Perubahan status akan diinformasikan melalui WhatsApp.
              </p>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
              <StatusInfo
                icon={<Clock size={20} />}
                title="Dibuat"
                value={order.createdAt}
              />

              <StatusInfo
                icon={<CreditCard size={20} />}
                title="Pembayaran"
                value="Menunggu Konfirmasi"
              />

              <StatusInfo
                icon={<ShoppingBag size={20} />}
                title="Order"
                value="Diproses"
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">Timeline Pesanan</h2>

            <div className="mt-6 space-y-5">
              <TimelineItem
                active
                done
                title="Pesanan dibuat"
                subtitle="Pesanan berhasil masuk ke sistem toko."
              />

              <TimelineItem
                active
                done
                title="Menunggu pembayaran"
                subtitle="Pembeli mengikuti instruksi transfer atau QRIS."
              />

              <TimelineItem
                active
                title="Diproses toko"
                subtitle="Toko sedang menyiapkan pesanan."
              />

              <TimelineItem
                title="Selesai"
                subtitle="Pesanan sudah selesai diproses."
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">Data Pembeli</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBox
                icon={<User size={18} />}
                label="Nama Pembeli"
                value={order.customerName}
              />

              <InfoBox
                icon={<Phone size={18} />}
                label="Nomor WhatsApp"
                value={order.customerPhone}
              />

              <div className="md:col-span-2">
                <InfoBox
                  icon={<MapPin size={18} />}
                  label="Alamat"
                  value={order.customerAddress}
                />
              </div>

              <div className="md:col-span-2">
                <InfoBox
                  icon={<MessageCircle size={18} />}
                  label="Catatan"
                  value={order.customerNote || 'Tidak ada catatan'}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-black">Ringkasan Pesanan</h2>

          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[58px_1fr_auto] gap-3 rounded-2xl bg-[#F8FAFC] p-3"
              >
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
                  <h3 className="line-clamp-2 text-sm font-black text-[#1E293B]">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs font-bold text-[#64748B]">
                    {item.qty} x {formatCurrency(item.price)}
                  </p>
                </div>

                <p className="text-right text-sm font-black text-[#1E293B]">
                  {formatCurrency(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
            <SummaryRow label="Diskon" value={`- ${formatCurrency(order.discount)}`} />
            <SummaryRow
              label="Ongkir"
              value={
                order.shippingCost > 0
                  ? formatCurrency(order.shippingCost)
                  : 'Diatur toko'
              }
            />

            <div className="border-t border-dashed border-[#CBD5E1] pt-4">
              <SummaryRow
                label="Total"
                value={formatCurrency(order.total)}
                bold
              />
            </div>
          </div>

          <Link
            href={`/payment/${order.orderCode}`}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-xl transition hover:scale-[1.01]"
          >
            Lihat Pembayaran
            <ArrowRight size={18} />
          </Link>

          <div className="mt-5 rounded-2xl bg-[#FFF1E6] p-4">
            <p className="text-sm font-semibold leading-7 text-[#92400E]">
              Simpan kode order ini untuk mengecek status pesanan kembali.
            </p>
          </div>
        </aside>
      </section>

      <StoreFooter businessName={store.businessName} />
    </main>
  );
}

function StatusInfo({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E]">
        {icon}
      </div>

      <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#94A3B8]">
        {title}
      </p>

      <h3 className="mt-1 text-sm font-black text-[#1E293B]">
        {value}
      </h3>
    </div>
  );
}

function TimelineItem({
  title,
  subtitle,
  active = false,
  done = false,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          active
            ? 'bg-[#009A3E] text-white'
            : 'bg-[#F1F5F9] text-[#94A3B8]'
        }`}
      >
        {done ? <CheckCircle2 size={20} /> : <Clock size={20} />}
      </div>

      <div>
        <h3
          className={`text-base font-black ${
            active ? 'text-[#1E293B]' : 'text-[#94A3B8]'
          }`}
        >
          {title}
        </h3>

        <p className="mt-1 text-sm font-semibold leading-7 text-[#64748B]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4">
      <div className="flex items-center gap-2 text-[#009A3E]">
        {icon}
        <p className="text-xs font-black uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-bold leading-7 text-[#1E293B]">
        {value}
      </p>
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