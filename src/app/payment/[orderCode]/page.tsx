import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ClipboardCopy,
  CreditCard,
  FileImage,
  Info,
  PackageSearch,
  QrCode,
  ReceiptText,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import {
  getStorefrontData,
  resolveSubdomain,
} from '@/lib/store-resolver';

export default async function PaymentPage({
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

  const payment = store.paymentSettings;

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#102033]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
        contentType={store.contentType}
        logoUrl={store.logoUrl}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <Link
            href={`/order/${orderCode}`}
            className="inline-flex items-center gap-2 text-sm font-black"
            style={{ color: store.primaryColor }}
          >
            <ArrowLeft size={17} />
            Kembali ke tracking order
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Instruksi Pembayaran
              </h1>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Selesaikan pembayaran sesuai metode yang dipilih, lalu tunggu
                konfirmasi dari toko.
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
                <ShieldCheck size={15} />
                Menunggu Konfirmasi
              </div>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Total Pembayaran{' '}
                <span id="payment-total-heading">Rp 0</span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/85 md:text-base">
                Pembayaran akan dikonfirmasi manual oleh toko setelah dana atau
                bukti pembayaran diterima.
              </p>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
              <StatusInfo
                icon={<CreditCard size={20} />}
                title="Metode"
                valueId="payment-method-label"
                value="Menunggu data"
                primaryColor={store.primaryColor}
              />

              <StatusInfo
                icon={<ReceiptText size={20} />}
                title="Kode Order"
                value={orderCode}
                primaryColor={store.primaryColor}
              />

              <StatusInfo
                icon={<CheckCircle2 size={20} />}
                title="Status"
                value="Menunggu Konfirmasi"
                primaryColor={store.primaryColor}
              />
            </div>
          </section>

          {payment.transferEnabled && (
            <section
              id="transfer-section"
              className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Transfer Bank</h2>

                  <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                    Transfer sesuai nominal total ke rekening toko berikut.
                  </p>
                </div>

                <div
                  className="hidden h-14 w-14 items-center justify-center rounded-2xl text-white md:flex"
                  style={{ backgroundColor: store.primaryColor }}
                >
                  <Banknote size={26} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <PaymentInfo label="Bank" value={payment.bankName || '-'} />

                <PaymentInfo
                  label="Atas Nama"
                  value={payment.bankAccountOwner || '-'}
                />

                <div className="md:col-span-2">
                  <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                    <p className="text-xs font-black uppercase tracking-wide text-[#94A3B8]">
                      Nomor Rekening
                    </p>

                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <p
                        id="bank-account-number"
                        className="text-3xl font-black tracking-wide text-[#102033]"
                      >
                        {payment.bankAccountNumber || '-'}
                      </p>

                      <button
                        id="copy-bank-button"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg"
                        style={{ backgroundColor: store.primaryColor }}
                      >
                        Salin
                        <ClipboardCopy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {payment.qrisEnabled && (
            <section
              id="qris-section"
              className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">QRIS Statis</h2>

                  <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                    Scan QRIS toko dan lakukan pembayaran sesuai total order.
                  </p>
                </div>

                <div
                  className="hidden h-14 w-14 items-center justify-center rounded-2xl text-white md:flex"
                  style={{ backgroundColor: store.primaryColor }}
                >
                  <QrCode size={26} />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[260px_1fr] md:items-center">
                <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC]">
                  {payment.qrisImageUrl ? (
                    <Image
                      src={payment.qrisImageUrl}
                      alt={payment.qrisName || 'QRIS Toko'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#94A3B8]">
                      <QrCode size={54} />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <PaymentInfo
                    label="Nama QRIS"
                    value={payment.qrisName || '-'}
                  />
                  <PaymentInfo
                    label="Merchant"
                    value={payment.qrisMerchantNumber || '-'}
                  />

                  <div className="rounded-2xl bg-[#FFF1E6] p-4">
                    <div className="flex gap-3">
                      <Info size={20} className="mt-1 shrink-0 text-[#FF7A1A]" />
                      <p className="text-sm font-semibold leading-7 text-[#92400E]">
                        QRIS ini adalah QRIS statis milik toko. Pastikan nominal
                        pembayaran sesuai total order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  Upload Bukti Pembayaran
                </h2>

                <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                  Upload bukti transfer atau QRIS agar toko lebih mudah
                  melakukan konfirmasi.
                </p>
              </div>

              <div
                className="hidden h-14 w-14 items-center justify-center rounded-2xl text-white md:flex"
                style={{ backgroundColor: store.primaryColor }}
              >
                <FileImage size={26} />
              </div>
            </div>

            <div className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-sm"
                style={{ backgroundColor: store.primaryColor }}
              >
                <UploadCloud size={30} />
              </div>

              <h3 className="mt-5 text-xl font-black text-[#102033]">
                Pilih File Bukti Pembayaran
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-[#64748B]">
                Format gambar JPG/PNG. Bukti pembayaran akan dikirim ke toko
                untuk proses konfirmasi manual.
              </p>

              <input
                id="payment-proof-input"
                type="file"
                accept="image/*"
                className="hidden"
              />

              <button
                id="payment-proof-button"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg"
                style={{ backgroundColor: store.primaryColor }}
              >
                Upload Bukti
                <UploadCloud size={17} />
              </button>

              <p
                id="payment-proof-message"
                className="mt-4 hidden rounded-2xl px-4 py-3 text-sm font-bold"
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-black">Ringkasan Pesanan</h2>

          <div id="payment-items" className="mt-5 space-y-4" />

          <div className="mt-6 space-y-4">
            <SummaryRow id="payment-subtotal" label="Subtotal" value="Rp 0" />
            <SummaryRow id="payment-discount" label="Diskon" value="- Rp 0" />
            <SummaryRow id="payment-shipping" label="Ongkir" value="Diatur toko" />

            <div className="border-t border-dashed border-[#CBD5E1] pt-4">
              <SummaryRow id="payment-total" label="Total Bayar" value="Rp 0" bold />
            </div>
          </div>

          <Link
            href={`/order/${orderCode}`}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-xl transition hover:scale-[1.01]"
            style={{ backgroundColor: store.primaryColor }}
          >
            Tracking Order
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/products"
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#102033] transition hover:bg-[#F8FAFC]"
          >
            Belanja Lagi
          </Link>

          <p
            id="payment-message"
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

      <PaymentScript
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
  valueId?: string;
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

function PaymentInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <p className="text-xs font-black uppercase tracking-wide text-[#94A3B8]">
        {label}
      </p>

      <h3 className="mt-2 text-lg font-black text-[#102033]">
        {value}
      </h3>
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
            Toko belum tersedia untuk menampilkan instruksi pembayaran.
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

function PaymentScript({
  orderCode,
  primaryColor,
}: {
  orderCode: string;
  primaryColor: string;
}) {
  const script = `
(function () {
  const CHECKOUT_KEY = 'talase_checkout_draft';
  const ORDER_KEY_PREFIX = 'talase_order_';
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

  function paymentMethodLabel(method) {
    if (method === 'qris') return 'QRIS Statis';
    if (method === 'transfer') return 'Transfer Bank';
    return 'Belum dipilih';
  }

  function renderEmpty() {
    const itemsEl = document.getElementById('payment-items');
    if (!itemsEl) return;

    itemsEl.innerHTML = \`
      <div class="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
        <p class="text-sm font-black text-[#102033]">Order tidak ditemukan</p>
        <p class="mt-2 text-xs font-semibold leading-6 text-[#64748B]">
          Data order belum tersedia di browser ini. Silakan ulangi checkout atau gunakan tracking dari order yang valid.
        </p>
        <a href="/products" class="mt-4 inline-flex rounded-xl px-4 py-3 text-xs font-black text-white" style="background:\${primaryColor}">
          Lihat Produk
        </a>
      </div>
    \`;

    setMessage('payment-message', 'Order tidak ditemukan di browser ini.', 'error');
  }

  function renderOrder(order) {
    const items = Array.isArray(order.items) ? order.items : [];
    const subtotal = Number(order.subtotal || items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0));
    const discount = Number(order.discount || 0);
    const shippingCost = Number(order.shippingCost || 0);
    const total = Number(order.total || subtotal - discount + shippingCost);

    const heading = document.getElementById('payment-total-heading');
    const methodLabel = document.getElementById('payment-method-label');
    const itemsEl = document.getElementById('payment-items');
    const subtotalEl = document.getElementById('payment-subtotal');
    const discountEl = document.getElementById('payment-discount');
    const shippingEl = document.getElementById('payment-shipping');
    const totalEl = document.getElementById('payment-total');

    if (heading) heading.textContent = formatCurrency(total);
    if (methodLabel) methodLabel.textContent = paymentMethodLabel(order.paymentMethod);

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

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (discountEl) discountEl.textContent = '- ' + formatCurrency(discount);
    if (shippingEl) shippingEl.textContent = shippingCost > 0 ? formatCurrency(shippingCost) : 'Diatur toko';
    if (totalEl) totalEl.textContent = formatCurrency(total);

    const transferSection = document.getElementById('transfer-section');
    const qrisSection = document.getElementById('qris-section');

    if (transferSection) {
      transferSection.style.display = order.paymentMethod === 'transfer' ? 'block' : 'none';
    }

    if (qrisSection) {
      qrisSection.style.display = order.paymentMethod === 'qris' ? 'block' : 'none';
    }
  }

  function bindEvents() {
    const copyButton = document.getElementById('copy-bank-button');
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        const value = document.getElementById('bank-account-number')?.textContent || '';
        try {
          await navigator.clipboard.writeText(value.trim());
          setMessage('payment-message', 'Nomor rekening berhasil disalin.', 'success');
        } catch (_) {
          setMessage('payment-message', 'Tidak bisa menyalin otomatis. Silakan salin manual.', 'error');
        }
      });
    }

    const proofButton = document.getElementById('payment-proof-button');
    const proofInput = document.getElementById('payment-proof-input');

    if (proofButton && proofInput) {
      proofButton.addEventListener('click', () => proofInput.click());

      proofInput.addEventListener('change', () => {
        const file = proofInput.files && proofInput.files[0];
        if (!file) return;

        setMessage(
          'payment-proof-message',
          'Bukti dipilih: ' + file.name + '. Upload Cloudinary/Function disambungkan pada step backend.',
          'success'
        );

        const order = readOrder();
        if (order) {
          order.paymentProofFileName = file.name;
          order.updatedAt = new Date().toISOString();
          localStorage.setItem(ORDER_KEY_PREFIX + orderCode, JSON.stringify(order));
        }
      });
    }
  }

  const order = readOrder();

  if (!order) {
    renderEmpty();
  } else {
    renderOrder(order);
  }

  bindEvents();
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}