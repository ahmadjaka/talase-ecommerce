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

type OnlineOrderItem = {
  id?: string;
  productName?: string;
  name?: string;
  productImageUrl?: string;
  imageUrl?: string;
  qty?: number;
  quantity?: number;
  unitPrice?: number;
  price?: number;
  subtotal?: number;
  note?: string;
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

  const trackingSubdomain =
    ((store as any).subdomain || subdomain || '').toString();

  const orders = (await getOnlineOrdersBySubdomain(
    trackingSubdomain,
  )) as OnlineOrder[];

  const selectedOrder =
    orders.find((order) => order.orderCode === orderCode) ??
    (orders.length === 1 ? orders[0] : null);

  const selectedItems = selectedOrder
    ? ((await getOnlineOrderItems(selectedOrder.id)) as OnlineOrderItem[])
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
                Pesanan toko ini
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
              <p className="text-sm font-black text-[#102033]">
                Belum ada order ditemukan
              </p>
              <p className="mt-2 text-xs font-semibold leading-6 text-[#64748B]">
                Pesanan tidak ditemukan pada toko ini.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex rounded-xl px-4 py-3 text-xs font-black text-white"
                style={{ backgroundColor: store.primaryColor }}
              >
                Lihat Produk
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {orders.map((order) => {
                const active = selectedOrder?.id === order.id;

                return (
                  <Link
                    key={order.id}
                    href={`/order/${order.orderCode || order.id}`}
                    className="block rounded-2xl border bg-white p-4 text-left transition hover:bg-[#F8FAFC]"
                    style={{
                      borderColor: active ? store.primaryColor : '#E2E8F0',
                      boxShadow: active
                        ? '0 14px 36px rgba(15, 23, 42, 0.10)'
                        : 'none',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[#102033]">
                          {order.orderCode || order.id}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#64748B]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <span
                        className="rounded-full px-3 py-1 text-[10px] font-black"
                        style={{
                          backgroundColor: `${store.primaryColor}14`,
                          color: store.primaryColor,
                        }}
                      >
                        {orderStatusLabel(order.orderStatus)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xs font-bold text-[#64748B]">
                        {paymentStatusLabel(order.paymentStatus)}
                      </p>
                      <p className="text-sm font-black text-[#102033]">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-[#FFF1E6] p-4">
            <p className="text-sm font-semibold leading-7 text-[#92400E]">
              Jika pesanan tidak muncul, buka kembali link tracking dari halaman
              pembayaran atau hubungi admin toko.
            </p>
          </div>
        </aside>

        {!selectedOrder ? (
          <div className="rounded-[32px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
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
        ) : (
          <div className="space-y-6">
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

                <h2 className="mt-5 text-3xl font-black md:text-4xl">
                  {headingByStatus(selectedOrder.orderStatus)}
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/85 md:text-base">
                  {descriptionByStatus(selectedOrder.orderStatus)}
                </p>
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
                <StatusInfo
                  icon={<Clock size={20} />}
                  title="Dibuat"
                  value={formatDate(selectedOrder.createdAt)}
                  primaryColor={store.primaryColor}
                />
                <StatusInfo
                  icon={<CreditCard size={20} />}
                  title="Pembayaran"
                  value={`${paymentStatusLabel(
                    selectedOrder.paymentStatus,
                  )} • ${paymentMethodLabel(selectedOrder.paymentMethod)}`}
                  primaryColor={store.primaryColor}
                />
                <StatusInfo
                  icon={<ShoppingBag size={20} />}
                  title="Order"
                  value={orderStatusLabel(selectedOrder.orderStatus)}
                  primaryColor={store.primaryColor}
                />
              </div>
            </section>

            <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-2xl font-black">Timeline Pesanan</h2>
              <div className="mt-6 space-y-5">
                <TimelineItem
                  active
                  done
                  primaryColor={store.primaryColor}
                  icon={<CheckCircle2 size={20} />}
                  title="Pesanan dibuat"
                  subtitle="Pesanan berhasil masuk ke sistem toko."
                />
                <TimelineItem
                  active={isPaymentStepActive(selectedOrder)}
                  done={selectedOrder.paymentStatus === 'paid'}
                  primaryColor={store.primaryColor}
                  icon={<Clock size={20} />}
                  title="Pembayaran"
                  subtitle="Pembeli mengikuti instruksi transfer atau QRIS."
                />
                <TimelineItem
                  active={isProcessingStepActive(selectedOrder)}
                  done={
                    selectedOrder.orderStatus === 'ready' ||
                    selectedOrder.orderStatus === 'completed'
                  }
                  primaryColor={store.primaryColor}
                  icon={<PackageCheck size={20} />}
                  title="Diproses toko"
                  subtitle="Toko sedang menyiapkan pesanan."
                />
                <TimelineItem
                  active={isFinalStepActive(selectedOrder)}
                  done={selectedOrder.orderStatus === 'completed'}
                  danger={
                    selectedOrder.orderStatus === 'cancelled' ||
                    selectedOrder.orderStatus === 'rejected'
                  }
                  primaryColor={store.primaryColor}
                  icon={
                    selectedOrder.orderStatus === 'cancelled' ||
                    selectedOrder.orderStatus === 'rejected' ? (
                      <XCircle size={20} />
                    ) : (
                      <CheckCircle2 size={20} />
                    )
                  }
                  title={
                    selectedOrder.orderStatus === 'cancelled'
                      ? 'Dibatalkan'
                      : selectedOrder.orderStatus === 'rejected'
                        ? 'Ditolak'
                        : 'Selesai'
                  }
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
                  value={selectedOrder.customerName || '-'}
                  primaryColor={store.primaryColor}
                />
                <InfoBox
                  icon={<Phone size={18} />}
                  label="Nomor WhatsApp"
                  value={selectedOrder.customerPhone || '-'}
                  primaryColor={store.primaryColor}
                />
                <div className="md:col-span-2">
                  <InfoBox
                    icon={<MapPin size={18} />}
                    label="Alamat"
                    value={selectedOrder.customerAddress || '-'}
                    primaryColor={store.primaryColor}
                  />
                </div>
                <div className="md:col-span-2">
                  <InfoBox
                    icon={<MessageCircle size={18} />}
                    label="Catatan"
                    value={selectedOrder.customerNote || 'Tidak ada catatan'}
                    primaryColor={store.primaryColor}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-2xl font-black">Ringkasan Pesanan</h2>

              <div className="mt-5 space-y-4">
                {selectedItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
                    <p className="text-sm font-black text-[#102033]">
                      Item pesanan tidak ditemukan
                    </p>
                  </div>
                ) : (
                  selectedItems.map((item, index) => {
                    const name = item.productName || item.name || 'Produk';
                    const imageUrl = item.productImageUrl || item.imageUrl || '';
                    const qty = Number(item.qty || item.quantity || 1);
                    const price = Number(item.unitPrice || item.price || 0);
                    const subtotal = Number(item.subtotal || price * qty);

                    return (
                      <div
                        key={item.id || index}
                        className="grid grid-cols-[58px_1fr_auto] gap-3 rounded-2xl bg-[#F8FAFC] p-3"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-black text-[#94A3B8]">
                              Produk
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="line-clamp-2 text-sm font-black text-[#102033]">
                            {name}
                          </h3>
                          <p className="mt-1 text-xs font-bold text-[#64748B]">
                            {qty} x {formatCurrency(price)}
                          </p>
                        </div>

                        <p className="text-right text-sm font-black text-[#102033]">
                          {formatCurrency(subtotal)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-6 space-y-4">
                <SummaryRow
                  label="Subtotal"
                  value={formatCurrency(selectedOrder.subtotal)}
                />
                <SummaryRow
                  label="Diskon"
                  value={`- ${formatCurrency(selectedOrder.discount)}`}
                />
                <SummaryRow
                  label="Ongkir"
                  value={
                    Number(selectedOrder.shippingCost || 0) > 0
                      ? formatCurrency(selectedOrder.shippingCost)
                      : 'Diatur toko'
                  }
                />
                <div className="border-t border-dashed border-[#CBD5E1] pt-4">
                  <SummaryRow
                    label="Total"
                    value={formatCurrency(selectedOrder.total)}
                    bold
                  />
                </div>
              </div>

              <Link
                href={`/payment/${selectedOrder.orderCode || orderCode}`}
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
        )}
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
  primaryColor,
}: {
  icon: ReactNode;
  title: string;
  value: string;
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
      <h3 className="mt-1 text-sm font-black text-[#102033]">{value}</h3>
    </div>
  );
}

function TimelineItem({
  active,
  done,
  danger = false,
  icon,
  title,
  subtitle,
  primaryColor,
}: {
  active: boolean;
  done?: boolean;
  danger?: boolean;
  icon: ReactNode;
  title: string;
  subtitle: string;
  primaryColor: string;
}) {
  const color = danger ? '#E60046' : primaryColor;

  return (
    <div className="flex gap-4">
      <div
        className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: active ? color : '#F1F5F9',
          color: active ? '#FFFFFF' : '#94A3B8',
        }}
      >
        {done ? <CheckCircle2 size={20} /> : icon}
      </div>
      <div>
        <h3
          className="text-base font-black"
          style={{ color: active ? '#102033' : '#94A3B8' }}
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
  primaryColor,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  primaryColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4">
      <div className="flex items-center gap-2" style={{ color: primaryColor }}>
        {icon}
        <p className="text-xs font-black uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-bold leading-7 text-[#102033]">
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
            ? 'text-base font-black text-[#102033]'
            : 'text-sm font-bold text-[#64748B]'
        }
      >
        {label}
      </p>
      <p
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

function formatCurrency(value?: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('id-ID');
}

function orderStatusLabel(status?: string) {
  switch (status) {
    case 'processing':
      return 'Diproses';
    case 'ready':
      return 'Siap';
    case 'completed':
      return 'Selesai';
    case 'cancelled':
      return 'Dibatalkan';
    case 'rejected':
      return 'Ditolak';
    case 'waiting_payment':
      return 'Menunggu Pembayaran';
    default:
      return 'Pesanan Baru';
  }
}

function paymentStatusLabel(status?: string) {
  switch (status) {
    case 'paid':
      return 'Sudah Dibayar';
    case 'waiting_payment':
      return 'Menunggu Pembayaran';
    case 'cancelled':
      return 'Dibatalkan';
    case 'rejected':
      return 'Ditolak';
    default:
      return 'Menunggu Konfirmasi';
  }
}

function paymentMethodLabel(method?: string) {
  switch (method) {
    case 'qris':
      return 'QRIS';
    case 'transfer':
      return 'Transfer';
    case 'cash':
      return 'Cash';
    default:
      return 'Belum dipilih';
  }
}

function headingByStatus(status?: string) {
  switch (status) {
    case 'processing':
      return 'Pesanan Sedang Diproses';
    case 'ready':
      return 'Pesanan Siap';
    case 'completed':
      return 'Pesanan Selesai';
    case 'cancelled':
      return 'Pesanan Dibatalkan';
    case 'rejected':
      return 'Pesanan Ditolak';
    case 'waiting_payment':
      return 'Menunggu Pembayaran';
    default:
      return 'Pesanan Berhasil Dibuat';
  }
}

function descriptionByStatus(status?: string) {
  switch (status) {
    case 'processing':
      return 'Toko sedang menyiapkan pesanan Anda. Perubahan status akan diinformasikan melalui WhatsApp.';
    case 'ready':
      return 'Pesanan sudah siap. Silakan tunggu instruksi dari toko.';
    case 'completed':
      return 'Pesanan Anda sudah selesai diproses oleh toko.';
    case 'cancelled':
      return 'Pesanan ini telah dibatalkan.';
    case 'rejected':
      return 'Pesanan ini ditolak oleh toko.';
    case 'waiting_payment':
      return 'Silakan selesaikan pembayaran sesuai instruksi yang tersedia.';
    default:
      return 'Pesanan berhasil dibuat dan menunggu proses konfirmasi toko.';
  }
}

function isPaymentStepActive(order: OnlineOrder) {
  return [
    'waiting_payment',
    'paid',
    'processing',
    'ready',
    'completed',
  ].includes(order.orderStatus || '') || order.paymentStatus === 'paid';
}

function isProcessingStepActive(order: OnlineOrder) {
  return ['processing', 'ready', 'completed'].includes(
    order.orderStatus || '',
  );
}

function isFinalStepActive(order: OnlineOrder) {
  return ['completed', 'cancelled', 'rejected'].includes(
    order.orderStatus || '',
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
          <h1 className="mt-6 text-3xl font-black md:text-4xl">{title}</h1>
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