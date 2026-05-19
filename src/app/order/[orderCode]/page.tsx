import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  MessageCircle,
  PackageCheck,
  PackageSearch,
  Phone,
  ReceiptText,
  ShoppingBag,
  User,
  XCircle,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';
import {
  getOnlineOrderItems,
  getOnlineOrdersBySubdomain,
} from '@/lib/order-resolver';

import {
  getStorefrontData,
  resolveSubdomain,
} from '@/lib/store-resolver';

const firebaseConfig = {
  apiKey: 'AIzaSyC1M0GEIE3OxBgZ3Jdv-Ui516uLhRdYdCM',
  authDomain: 'talase-pos.firebaseapp.com',
  projectId: 'talase-pos',
  storageBucket: 'talase-pos.firebasestorage.app',
  messagingSenderId: '1061126584585',
  appId: '1:1061126584585:web:e2d1b4bbf5c631088dbbd8',
};

type OnlineOrder = {
  id: string;
  orderCode?: string;
  orderId?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string;
  subtotal?: number;
  discount?: number;
  shippingCost?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  const { orderCode } = await params;
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStorefrontData(subdomain);

  if (store.resolveStatus !== 'ready') {
    return <StoreStatusPage store={store} />;
  }

  const storeMeta = store as Awaited<ReturnType<typeof getStorefrontData>> & {
    mitraId?: string;
    id?: string;
  };

  const mitraId = storeMeta.mitraId || storeMeta.id || '';

  const trackingSubdomain =
    ((store as any).subdomain || subdomain || '').toString();

  const orders = (await getOnlineOrdersBySubdomain(
    trackingSubdomain,
  )) as OnlineOrder[];

  const selectedOrder =
    orders.find(
      (order: OnlineOrder) => order.orderCode === orderCode,
    ) ??
    (orders.length === 1 ? orders[0] : null);

  const selectedItems = selectedOrder
    ? await getOnlineOrderItems(selectedOrder.id)
    : [];

  return (
    <main
      className="min-h-screen bg-[#F7FAFC] text-[#102033]"
      style={{ fontFamily: store.fontFamily }}
    >
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
        contentType={store.contentType}
        logoUrl={store.logoUrl}
        facebookUrl={store.facebookUrl}
        instagramUrl={store.instagramUrl}
        tiktokUrl={store.tiktokUrl}
        whatsappUrl={store.whatsapp}
        primaryColor={store.primaryColor}
        secondaryColor={store.secondaryColor}
        accentColor={store.accentColor}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-black"
            style={{ color: store.primaryColor }}
          >
            <ArrowLeft size={17} />
            Kembali ke toko
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Pesanan Saya
              </h1>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Pilih pesanan untuk melihat detail pembayaran, status, dan
                tracking proses toko.
              </p>
            </div>

            <div
              className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black"
              style={{
                backgroundColor: '#FFF1E6',
                color: store.accentColor,
              }}
            >
              <ReceiptText size={17} />
              Tracking Order
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[420px_1fr]">
        <aside className="h-fit rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: store.primaryColor }}
            >
              <PackageSearch size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-black">List Order</h2>
              <p className="mt-1 text-xs font-bold text-[#64748B]">
                Pesanan dari browser ini
              </p>
            </div>
          </div>

          <div
            id="order-list-message"
            className="mt-5 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center"
          >
            <p className="text-sm font-black text-[#102033]">
              Memuat pesanan...
            </p>
            <p className="mt-2 text-xs font-semibold leading-6 text-[#64748B]">
              Sistem sedang mengambil data order.
            </p>
          </div>

          <div id="order-list" className="mt-5 hidden space-y-3" />

          <div className="mt-6 rounded-2xl bg-[#FFF1E6] p-4">
            <p className="text-sm font-semibold leading-7 text-[#92400E]">
              Jika pesanan tidak muncul, buka kembali link tracking dari halaman
              pembayaran atau hubungi admin toko.
            </p>
          </div>
        </aside>

        <div id="order-detail-empty" className="rounded-[32px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white"
            style={{ backgroundColor: store.primaryColor }}
          >
            <PackageCheck size={30} />
          </div>

          <h2 className="mt-5 text-3xl font-black">
            Pilih pesanan terlebih dahulu
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-[#64748B]">
            Detail status, data pembeli, produk, dan pembayaran akan muncul
            setelah salah satu pesanan dipilih.
          </p>
        </div>

        <div id="order-detail" className="hidden space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-white shadow-sm">
            <div
              className="p-6 text-white md:p-8"
              style={{
                background: `linear-gradient(135deg, ${store.primaryColor}, ${store.secondaryColor})`,
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide backdrop-blur-md">
                <PackageCheck size={15} />
                Status Pesanan
              </div>

              <h2
                id="order-status-heading"
                className="mt-5 text-3xl font-black md:text-4xl"
              >
                -
              </h2>

              <p
                id="order-status-description"
                className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/85 md:text-base"
              >
                -
              </p>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
              <StatusInfo
                icon={<Clock size={20} />}
                title="Dibuat"
                valueId="order-created-at"
                value="-"
                primaryColor={store.primaryColor}
              />

              <StatusInfo
                icon={<CreditCard size={20} />}
                title="Pembayaran"
                valueId="payment-status-label"
                value="-"
                primaryColor={store.primaryColor}
              />

              <StatusInfo
                icon={<ShoppingBag size={20} />}
                title="Order"
                valueId="order-status-label"
                value="-"
                primaryColor={store.primaryColor}
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">Timeline Pesanan</h2>

            <div className="mt-6 space-y-5">
              <TimelineItem
                id="timeline-created"
                title="Pesanan dibuat"
                subtitle="Pesanan berhasil masuk ke sistem toko."
              />

              <TimelineItem
                id="timeline-payment"
                title="Menunggu pembayaran"
                subtitle="Pembeli mengikuti instruksi transfer atau QRIS."
              />

              <TimelineItem
                id="timeline-processing"
                title="Diproses toko"
                subtitle="Toko sedang menyiapkan pesanan."
              />

              <TimelineItem
                id="timeline-completed"
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
                valueId="customer-name"
                value="-"
                primaryColor={store.primaryColor}
              />

              <InfoBox
                icon={<Phone size={18} />}
                label="Nomor WhatsApp"
                valueId="customer-phone"
                value="-"
                primaryColor={store.primaryColor}
              />

              <div className="md:col-span-2">
                <InfoBox
                  icon={<MapPin size={18} />}
                  label="Alamat"
                  valueId="customer-address"
                  value="-"
                  primaryColor={store.primaryColor}
                />
              </div>

              <div className="md:col-span-2">
                <InfoBox
                  icon={<MessageCircle size={18} />}
                  label="Catatan"
                  valueId="customer-note"
                  value="-"
                  primaryColor={store.primaryColor}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-black">Ringkasan Pesanan</h2>

            <div id="order-items" className="mt-5 space-y-4" />

            <div className="mt-6 space-y-4">
              <SummaryRow id="order-subtotal" label="Subtotal" value="Rp 0" />
              <SummaryRow id="order-discount" label="Diskon" value="- Rp 0" />
              <SummaryRow id="order-shipping" label="Ongkir" value="Diatur toko" />

              <div className="border-t border-dashed border-[#CBD5E1] pt-4">
                <SummaryRow id="order-total" label="Total" value="Rp 0" bold />
              </div>
            </div>

            <Link
              id="payment-link"
              href={`/payment/${orderCode}`}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-xl transition hover:scale-[1.01]"
              style={{ backgroundColor: store.primaryColor }}
            >
              Lihat Pembayaran
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/products"
              className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#102033] transition hover:bg-[#F8FAFC]"
            >
              Belanja Lagi
            </Link>
          </section>
        </div>
      </section>

      <StoreFooter
        businessName={store.businessName}
        businessType={store.businessType}
        contentType={store.contentType}
        phone={store.phone}
        whatsapp={store.whatsapp}
        email={store.email}
        address={store.address}
        instagramUrl={store.instagramUrl}
        facebookUrl={store.facebookUrl}
        tiktokUrl={store.tiktokUrl}
        primaryColor={store.primaryColor}
        accentColor={store.accentColor}
      />

    </main>
  );
}

function StatusInfo({
  icon,
  title,
  value,
  valueId,
  primaryColor,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  valueId: string;
  primaryColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: primaryColor }}
      >
        {icon}
      </div>

      <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#94A3B8]">
        {title}
      </p>

      <h3 id={valueId} className="mt-1 text-sm font-black text-[#102033]">
        {value}
      </h3>
    </div>
  );
}

function TimelineItem({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div id={id} className="timeline-item flex gap-4">
      <div className="timeline-icon mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[#94A3B8]">
        <Clock size={20} />
      </div>

      <div>
        <h3 className="timeline-title text-base font-black text-[#94A3B8]">
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
  valueId,
  primaryColor,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueId: string;
  primaryColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4">
      <div className="flex items-center gap-2" style={{ color: primaryColor }}>
        {icon}

        <p className="text-xs font-black uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p id={valueId} className="mt-2 text-sm font-bold leading-7 text-[#102033]">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  id,
  label,
  value,
  bold = false,
}: {
  id: string;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p
        className={
          bold
            ? 'text-base font-black text-[#102033]'
            : 'text-sm font-bold text-[#64748B]'
        }
      >
        {label}
      </p>

      <p
        id={id}
        className={
          bold
            ? 'text-2xl font-black text-[#073B70]'
            : 'text-sm font-black text-[#102033]'
        }
      >
        {value}
      </p>
    </div>
  );
}

function StoreStatusPage({
  store,
}: {
  store: Awaited<ReturnType<typeof getStorefrontData>>;
}) {
  const title =
    store.resolveStatus === 'not_found'
      ? 'Toko tidak ditemukan'
      : store.resolveStatus === 'inactive'
        ? 'Toko sedang tidak aktif'
        : 'Website toko belum dipublish';

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#102033]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 py-12">
        <div className="w-full rounded-[34px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFF1E6] text-[#FF7A1A]">
            <PackageSearch size={30} />
          </div>

          <h1 className="mt-6 text-3xl font-black md:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-[#64748B] md:text-base">
            Toko belum tersedia untuk menampilkan tracking order.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#073B70] px-6 py-4 text-sm font-black text-white shadow-lg"
          >
            Kembali
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
