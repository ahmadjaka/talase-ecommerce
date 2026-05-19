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

      <OrderTrackingScript
        orderCode={orderCode}
        mitraId={mitraId}
        subdomain={subdomain}
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

function OrderTrackingScript({
  orderCode,
  mitraId,
  subdomain,
  primaryColor,
  accentColor,
}: {
  orderCode: string;
  mitraId: string;
  subdomain: string;
  primaryColor: string;
  accentColor: string;
}) {
  const script = `
(async function () {
  const firebaseConfig = ${JSON.stringify(firebaseConfig)};
  const initialOrderCode = ${JSON.stringify(orderCode)};
  const mitraId = ${JSON.stringify(mitraId)};
  const subdomain = ${JSON.stringify(subdomain)};
  const primaryColor = ${JSON.stringify(primaryColor)};
  const accentColor = ${JSON.stringify(accentColor)};

  const ORDER_KEY_PREFIX = 'talase_order_';
  const CHECKOUT_KEY = 'talase_checkout_draft';

  const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');

  const {
    getFirestore,
    collection,
    query,
    where,
    limit,
    getDocs,
    documentId
  } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const orderListEl = document.getElementById('order-list');
  const orderListMessageEl = document.getElementById('order-list-message');
  const detailEl = document.getElementById('order-detail');
  const detailEmptyEl = document.getElementById('order-detail-empty');

  function safeText(value, fallback = '-') {
    const text = value === null || value === undefined ? '' : String(value);
    return text.trim() ? text : fallback;
  }

  function toNumber(value) {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(toNumber(value));
  }

  function formatDate(value) {
    if (!value) return '-';

    if (value.toDate && typeof value.toDate === 'function') {
      return value.toDate().toLocaleString('id-ID');
    }

    if (value.seconds) {
      return new Date(value.seconds * 1000).toLocaleString('id-ID');
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '-';

    return parsed.toLocaleString('id-ID');
  }

  function getOrderMillis(order) {
    const value = order.createdAt;

    if (!value) return 0;
    if (value.toDate && typeof value.toDate === 'function') return value.toDate().getTime();
    if (value.seconds) return value.seconds * 1000;

    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '-';
  }

  function getLocalOrderCodes() {
    const codes = new Set();

    try {
      Object.keys(localStorage).forEach((key) => {
        if (!key.startsWith(ORDER_KEY_PREFIX)) return;

        const code = key.replace(ORDER_KEY_PREFIX, '').trim();
        if (code) codes.add(code);
      });

      const draft = localStorage.getItem(CHECKOUT_KEY);
      const parsedDraft = draft ? JSON.parse(draft) : null;

      if (parsedDraft && parsedDraft.orderCode) {
        codes.add(String(parsedDraft.orderCode));
      }
    } catch (_) {}

    if (initialOrderCode && initialOrderCode !== 'index' && initialOrderCode !== 'list') {
      codes.add(initialOrderCode);
    }

    return Array.from(codes);
  }

  async function findOrderByCode(code) {
    const q = query(
      collection(db, 'online_orders'),
      where('mitraId', '==', mitraId),
      where('orderCode', '==', code),
      limit(1)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    const doc = snap.docs[0];

    return {
      id: doc.id,
      ...doc.data()
    };
  }

  async function findOrders() {
    const q = query(
      collection(db, 'online_orders'),
      where('subdomain', '==', subdomain)
    );

    const snap = await getDocs(q);

    const orders = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    orders.sort((a, b) => getOrderMillis(b) - getOrderMillis(a));

    return orders;
  }

  async function findItems(order) {
    const q = query(
      collection(db, 'online_order_items'),
      where('mitraId', '==', mitraId),
      where('orderId', '==', order.id)
    );

    const snap = await getDocs(q);

    const fromCollection = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    if (fromCollection.length > 0) return fromCollection;

    if (Array.isArray(order.items)) return order.items;

    return [];
  }

  function paymentStatusLabel(status) {
    switch (status) {
      case 'paid':
        return 'Sudah Dibayar';
      case 'rejected':
        return 'Ditolak';
      case 'cancelled':
        return 'Dibatalkan';
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'waiting_confirmation':
      default:
        return 'Menunggu Konfirmasi';
    }
  }

  function paymentMethodLabel(method) {
    if (method === 'qris') return 'QRIS';
    if (method === 'transfer') return 'Transfer';
    if (method === 'cash') return 'Cash';
    return 'Belum dipilih';
  }

  function orderStatusLabel(status) {
    switch (status) {
      case 'waiting_payment':
        return 'Menunggu Pembayaran';
      case 'paid':
        return 'Pembayaran Diterima';
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
      case 'new':
      default:
        return 'Pesanan Baru';
    }
  }

  function headingByStatus(status) {
    switch (status) {
      case 'processing':
        return 'Pesanan Sedang Diproses';
      case 'completed':
        return 'Pesanan Selesai';
      case 'cancelled':
        return 'Pesanan Dibatalkan';
      case 'rejected':
        return 'Pesanan Ditolak';
      case 'waiting_payment':
        return 'Menunggu Pembayaran';
      case 'paid':
        return 'Pembayaran Sudah Diterima';
      case 'ready':
        return 'Pesanan Siap';
      case 'new':
      default:
        return 'Pesanan Berhasil Dibuat';
    }
  }

  function descriptionByStatus(status) {
    switch (status) {
      case 'processing':
        return 'Toko sedang menyiapkan pesanan Anda. Perubahan status akan diinformasikan melalui WhatsApp.';
      case 'completed':
        return 'Pesanan Anda sudah selesai diproses oleh toko.';
      case 'cancelled':
        return 'Pesanan ini telah dibatalkan.';
      case 'rejected':
        return 'Pesanan ini ditolak oleh toko.';
      case 'waiting_payment':
        return 'Silakan selesaikan pembayaran sesuai instruksi yang tersedia.';
      case 'paid':
        return 'Pembayaran sudah diterima dan pesanan akan diproses toko.';
      case 'ready':
        return 'Pesanan sudah siap. Silakan tunggu instruksi dari toko.';
      case 'new':
      default:
        return 'Pesanan berhasil dibuat dan menunggu proses konfirmasi toko.';
    }
  }

  function resetTimeline() {
    document.querySelectorAll('.timeline-item').forEach((item) => {
      const icon = item.querySelector('.timeline-icon');
      const title = item.querySelector('.timeline-title');

      if (icon) {
        icon.style.backgroundColor = '#F1F5F9';
        icon.style.color = '#94A3B8';
        icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
      }

      if (title) {
        title.style.color = '#94A3B8';
      }
    });

    const completedTitle = document.querySelector('#timeline-completed .timeline-title');
    if (completedTitle) completedTitle.textContent = 'Selesai';
  }

  function setTimelineActive(id, done) {
    const item = document.getElementById(id);
    if (!item) return;

    const icon = item.querySelector('.timeline-icon');
    const title = item.querySelector('.timeline-title');

    if (icon) {
      icon.style.backgroundColor = primaryColor;
      icon.style.color = '#FFFFFF';
      icon.innerHTML = done
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
    }

    if (title) title.style.color = '#102033';
  }

  function renderTimeline(orderStatus, paymentStatus) {
    resetTimeline();
    setTimelineActive('timeline-created', true);

    if (
      paymentStatus === 'waiting_confirmation' ||
      paymentStatus === 'paid' ||
      orderStatus === 'waiting_payment' ||
      orderStatus === 'paid' ||
      orderStatus === 'processing' ||
      orderStatus === 'ready' ||
      orderStatus === 'completed'
    ) {
      setTimelineActive('timeline-payment', paymentStatus === 'paid' || orderStatus === 'paid' || orderStatus === 'processing' || orderStatus === 'ready' || orderStatus === 'completed');
    }

    if (
      orderStatus === 'processing' ||
      orderStatus === 'ready' ||
      orderStatus === 'completed'
    ) {
      setTimelineActive('timeline-processing', orderStatus === 'ready' || orderStatus === 'completed');
    }

    if (orderStatus === 'completed') {
      setTimelineActive('timeline-completed', true);
    }

    if (orderStatus === 'cancelled' || orderStatus === 'rejected') {
      const item = document.getElementById('timeline-completed');
      if (!item) return;

      const icon = item.querySelector('.timeline-icon');
      const title = item.querySelector('.timeline-title');

      if (icon) {
        icon.style.backgroundColor = '#E60046';
        icon.style.color = '#FFFFFF';
        icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg>';
      }

      if (title) {
        title.textContent = orderStatus === 'cancelled' ? 'Dibatalkan' : 'Ditolak';
        title.style.color = '#102033';
      }
    }
  }

  function renderOrderList(orders) {
    if (!orderListEl || !orderListMessageEl) return;

    if (orders.length === 0) {
      orderListEl.classList.add('hidden');
      orderListMessageEl.classList.remove('hidden');
      orderListMessageEl.innerHTML = \`
        <p class="text-sm font-black text-[#102033]">Belum ada order ditemukan</p>
        <p class="mt-2 text-xs font-semibold leading-6 text-[#64748B]">
          Pesanan tidak ditemukan pada toko ini atau belum tersimpan di browser.
        </p>
        <a href="/products" class="mt-4 inline-flex rounded-xl px-4 py-3 text-xs font-black text-white" style="background:\${primaryColor}">
          Lihat Produk
        </a>
      \`;
      return;
    }

    orderListMessageEl.classList.add('hidden');
    orderListEl.classList.remove('hidden');

    orderListEl.innerHTML = orders.map((order, index) => {
      const status = order.orderStatus || 'new';
      const paymentStatus = order.paymentStatus || 'waiting_confirmation';

      return \`
        <button
          type="button"
          class="order-list-button w-full rounded-2xl border border-[#E2E8F0] bg-white p-4 text-left transition hover:bg-[#F8FAFC]"
          data-order-index="\${index}"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-black text-[#102033]">\${escapeHtml(order.orderCode || order.id)}</p>
              <p class="mt-1 text-xs font-bold text-[#64748B]">\${formatDate(order.createdAt)}</p>
            </div>

            <span class="rounded-full px-3 py-1 text-[10px] font-black" style="background:\${primaryColor}14;color:\${primaryColor}">
              \${orderStatusLabel(status)}
            </span>
          </div>

          <div class="mt-4 flex items-center justify-between gap-3">
            <p class="text-xs font-bold text-[#64748B]">\${paymentStatusLabel(paymentStatus)}</p>
            <p class="text-sm font-black text-[#102033]">\${formatCurrency(order.total)}</p>
          </div>
        </button>
      \`;
    }).join('');

    orderListEl.querySelectorAll('.order-list-button').forEach((button) => {
      button.addEventListener('click', async () => {
        const index = Number(button.getAttribute('data-order-index') || 0);
        await selectOrder(orders[index], button);
      });
    });
  }

  function markActiveButton(activeButton) {
    document.querySelectorAll('.order-list-button').forEach((button) => {
      button.style.borderColor = '#E2E8F0';
      button.style.boxShadow = 'none';
    });

    if (activeButton) {
      activeButton.style.borderColor = primaryColor;
      activeButton.style.boxShadow = '0 14px 36px rgba(15, 23, 42, 0.10)';
    }
  }

  async function selectOrder(order, activeButton) {
    markActiveButton(activeButton);

    if (detailEl) detailEl.classList.remove('hidden');
    if (detailEmptyEl) detailEmptyEl.classList.add('hidden');

    const items = await findItems(order);

    renderOrder(order, items);

    if (window.innerWidth < 1024) {
      detailEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function normalizeItem(item) {
    const name =
      item.productName ||
      item.name ||
      item.title ||
      'Produk';

    const imageUrl =
      item.productImageUrl ||
      item.imageUrl ||
      '';

    const slug =
      item.slug ||
      item.productSlug ||
      item.productId ||
      '';

    const qty = toNumber(item.qty || item.quantity || 1);
    const price = toNumber(item.unitPrice || item.price || item.sellingPrice || 0);
    const subtotal = toNumber(item.subtotal || price * qty);

    return {
      name,
      imageUrl,
      slug,
      qty,
      price,
      subtotal,
      note: item.note || ''
    };
  }

  function renderOrder(order, rawItems) {
    const items = Array.isArray(rawItems) ? rawItems.map(normalizeItem) : [];

    const subtotal = toNumber(
      order.subtotal ||
      items.reduce((sum, item) => sum + item.subtotal, 0)
    );

    const discount = toNumber(order.discount || 0);
    const shippingCost = toNumber(order.shippingCost || 0);
    const total = toNumber(order.total || subtotal - discount + shippingCost);

    const orderStatus = order.orderStatus || 'new';
    const paymentStatus = order.paymentStatus || 'waiting_confirmation';
    const paymentMethod = order.paymentMethod || '';

    setText('order-status-heading', headingByStatus(orderStatus));
    setText('order-status-description', descriptionByStatus(orderStatus));
    setText('order-created-at', formatDate(order.createdAt));
    setText('payment-status-label', paymentStatusLabel(paymentStatus) + ' • ' + paymentMethodLabel(paymentMethod));
    setText('order-status-label', orderStatusLabel(orderStatus));

    setText('customer-name', order.customerName || '-');
    setText('customer-phone', order.customerPhone || '-');
    setText('customer-address', order.customerAddress || '-');
    setText('customer-note', order.customerNote || 'Tidak ada catatan');

    const itemsEl = document.getElementById('order-items');

    if (itemsEl) {
      if (items.length === 0) {
        itemsEl.innerHTML = \`
          <div class="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
            <p class="text-sm font-black text-[#102033]">Belum ada item pesanan</p>
            <p class="mt-2 text-xs font-semibold text-[#64748B]">Item pesanan tidak ditemukan.</p>
          </div>
        \`;
      } else {
        itemsEl.innerHTML = items.map((item) => {
          const image = item.imageUrl
            ? '<img src="' + escapeHtml(item.imageUrl) + '" alt="' + escapeHtml(item.name) + '" class="h-full w-full object-cover" />'
            : '<div class="flex h-full w-full items-center justify-center bg-[#F1F5F9] text-[#94A3B8]">Produk</div>';

          const href = item.slug ? '/products/' + encodeURIComponent(item.slug) : '/products';

          return \`
            <div class="grid grid-cols-[58px_1fr_auto] gap-3 rounded-2xl bg-[#F8FAFC] p-3">
              <a href="\${href}" class="relative block aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]">
                \${image}
              </a>

              <div>
                <h3 class="line-clamp-2 text-sm font-black text-[#102033]">\${escapeHtml(item.name)}</h3>
                <p class="mt-1 text-xs font-bold text-[#64748B]">\${item.qty} x \${formatCurrency(item.price)}</p>
                \${item.note ? '<p class="mt-1 line-clamp-1 text-[11px] font-semibold text-[#94A3B8]">Catatan: ' + escapeHtml(item.note) + '</p>' : ''}
              </div>

              <p class="text-right text-sm font-black text-[#102033]">\${formatCurrency(item.subtotal)}</p>
            </div>
          \`;
        }).join('');
      }
    }

    setText('order-subtotal', formatCurrency(subtotal));
    setText('order-discount', '- ' + formatCurrency(discount));
    setText('order-shipping', shippingCost > 0 ? formatCurrency(shippingCost) : 'Diatur toko');
    setText('order-total', formatCurrency(total));

    const paymentLink = document.getElementById('payment-link');
    if (paymentLink && order.orderCode) {
      paymentLink.setAttribute('href', '/payment/' + order.orderCode);
    }

    renderTimeline(orderStatus, paymentStatus);
  }

  async function init() {
    try {

      const orders = await findOrders();

      renderOrderList(orders);

      const targetIndex = orders.findIndex((order) => order.orderCode === initialOrderCode);
      const indexToSelect = targetIndex >= 0 ? targetIndex : orders.length === 1 ? 0 : -1;

      if (indexToSelect >= 0) {
        const button = document.querySelector('[data-order-index="' + indexToSelect + '"]');
        await selectOrder(orders[indexToSelect], button);
      }
    } catch (error) {
      console.error('ORDER TRACKING ERROR:', error);

      if (orderListMessageEl) {
        orderListMessageEl.classList.remove('hidden');
        orderListMessageEl.innerHTML = \`
          <p class="text-sm font-black text-[#102033]">Gagal memuat order</p>
          <p class="mt-2 text-xs font-semibold leading-6 text-[#64748B]">
            Terjadi kendala saat mengambil data pesanan.
          </p>
        \`;
      }
    }
  }

  init();
})();
`;

  return <script type="module" dangerouslySetInnerHTML={{ __html: script }} />;
}