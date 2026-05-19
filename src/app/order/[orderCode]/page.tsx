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
                Tracking Order
              </h1>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Pantau status pesanan Anda secara mudah tanpa login.
              </p>
            </div>

            <div
              className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black"
              style={{ backgroundColor: '#FFF1E6', color: store.accentColor }}
            >
              <ReceiptText size={17} />
              {orderCode}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_390px]">
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

              <h2
                id="order-status-heading"
                className="mt-5 text-3xl font-black md:text-4xl"
              >
                Memuat status pesanan
              </h2>

              <p
                id="order-status-description"
                className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/85 md:text-base"
              >
                Data tracking sedang disiapkan.
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
        </div>

        <aside className="h-fit rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
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

          <div className="mt-5 rounded-2xl bg-[#FFF1E6] p-4">
            <p className="text-sm font-semibold leading-7 text-[#92400E]">
              Simpan kode order ini untuk mengecek status pesanan kembali.
            </p>
          </div>

          <p
            id="order-message"
            className="mt-4 hidden rounded-2xl px-4 py-3 text-sm font-bold"
          />
        </aside>
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
        primaryColor={store.primaryColor}
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
  primaryColor,
}: {
  orderCode: string;
  primaryColor: string;
}) {
  const script = `
(function () {
  const ORDER_KEY_PREFIX = 'talase_order_';
  const CHECKOUT_KEY = 'talase_checkout_draft';
  const orderCode = ${JSON.stringify(orderCode)};
  const primaryColor = ${JSON.stringify(primaryColor)};

  function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function readOrder() {
    try {
      const savedOrder = localStorage.getItem(ORDER_KEY_PREFIX + orderCode);
      if (savedOrder) return JSON.parse(savedOrder);

      const draft = localStorage.getItem(CHECKOUT_KEY);
      const parsedDraft = draft ? JSON.parse(draft) : null;

      if (parsedDraft && parsedDraft.orderCode === orderCode) {
        localStorage.setItem(ORDER_KEY_PREFIX + orderCode, JSON.stringify(parsedDraft));
        return parsedDraft;
      }

      return null;
    } catch (_) {
      return null;
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '-';
  }

  function setMessage(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = text;
    el.classList.remove('hidden');

    if (type === 'success') {
      el.style.backgroundColor = '#DCFCE7';
      el.style.color = '#166534';
    } else {
      el.style.backgroundColor = '#FEE2E2';
      el.style.color = '#991B1B';
    }
  }

  function paymentStatusLabel(status) {
    switch (status) {
      case 'paid':
        return 'Sudah Dibayar';
      case 'rejected':
        return 'Ditolak';
      case 'cancelled':
        return 'Dibatalkan';
      case 'waiting_confirmation':
      default:
        return 'Menunggu Konfirmasi';
    }
  }

  function paymentMethodLabel(method) {
    if (method === 'qris') return 'QRIS Statis';
    if (method === 'transfer') return 'Transfer Bank';
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

    if (title) {
      title.style.color = '#102033';
    }
  }

  function renderTimeline(orderStatus, paymentStatus) {
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
      setTimelineActive('timeline-payment', paymentStatus === 'paid');
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

  function renderEmpty() {
    const itemsEl = document.getElementById('order-items');

    if (itemsEl) {
      itemsEl.innerHTML = \`
        <div class="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
          <p class="text-sm font-black text-[#102033]">Order tidak ditemukan</p>
          <p class="mt-2 text-xs font-semibold leading-6 text-[#64748B]">
            Data order belum tersedia di browser ini.
          </p>
          <a href="/products" class="mt-4 inline-flex rounded-xl px-4 py-3 text-xs font-black text-white" style="background:\${primaryColor}">
            Lihat Produk
          </a>
        </div>
      \`;
    }

    setText('order-status-heading', 'Order tidak ditemukan');
    setText('order-status-description', 'Data order tidak tersedia di browser ini atau kode order tidak valid.');
    setText('order-created-at', '-');
    setText('payment-status-label', '-');
    setText('order-status-label', '-');
    setMessage('order-message', 'Order tidak ditemukan di browser ini.', 'error');
  }

  function renderOrder(order) {
    const items = Array.isArray(order.items) ? order.items : [];
    const subtotal = Number(order.subtotal || items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0));
    const discount = Number(order.discount || 0);
    const shippingCost = Number(order.shippingCost || 0);
    const total = Number(order.total || subtotal - discount + shippingCost);
    const orderStatus = order.orderStatus || 'new';
    const paymentStatus = order.paymentStatus || 'waiting_confirmation';

    setText('order-status-heading', headingByStatus(orderStatus));
    setText('order-status-description', descriptionByStatus(orderStatus));
    setText('order-created-at', order.createdAt ? new Date(order.createdAt).toLocaleString('id-ID') : '-');
    setText('payment-status-label', paymentStatusLabel(paymentStatus));
    setText('order-status-label', orderStatusLabel(orderStatus));

    setText('customer-name', order.customerName || '-');
    setText('customer-phone', order.customerPhone || '-');
    setText('customer-address', order.customerAddress || '-');
    setText('customer-note', order.customerNote || 'Tidak ada catatan');

    const itemsEl = document.getElementById('order-items');

    if (itemsEl) {
      itemsEl.innerHTML = items.map((item) => \`
        <div class="grid grid-cols-[58px_1fr_auto] gap-3 rounded-2xl bg-[#F8FAFC] p-3">
          <a href="/products/\${item.slug}" class="relative block aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]">
            <img src="\${item.imageUrl}" alt="\${item.name}" class="h-full w-full object-cover" />
          </a>

          <div>
            <h3 class="line-clamp-2 text-sm font-black text-[#102033]">\${item.name}</h3>
            <p class="mt-1 text-xs font-bold text-[#64748B]">\${item.qty} x \${formatCurrency(item.price)}</p>
            \${item.note ? '<p class="mt-1 line-clamp-1 text-[11px] font-semibold text-[#94A3B8]">Catatan: ' + item.note + '</p>' : ''}
          </div>

          <p class="text-right text-sm font-black text-[#102033]">\${formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</p>
        </div>
      \`).join('');
    }

    setText('order-subtotal', formatCurrency(subtotal));
    setText('order-discount', '- ' + formatCurrency(discount));
    setText('order-shipping', shippingCost > 0 ? formatCurrency(shippingCost) : 'Diatur toko');
    setText('order-total', formatCurrency(total));

    renderTimeline(orderStatus, paymentStatus);
  }

  const order = readOrder();

  if (!order) {
    renderEmpty();
  } else {
    renderOrder(order);
  }
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}