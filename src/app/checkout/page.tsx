import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  PackageSearch,
  QrCode,
  ShieldCheck,
  Smartphone,
  User,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import {
  getStorefrontData,
  resolveSubdomain,
} from '@/lib/store-resolver';

import { CheckoutClient } from './checkout-client';

export default async function CheckoutPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStorefrontData(subdomain);

  if (store.resolveStatus !== 'ready') {
    return <StoreStatusPage store={store} />;
  }

  const safeProducts = store.products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
    stockQty: product.stockQty,
    stockEnabled: product.stockEnabled,
    isOutOfStock: product.isOutOfStock,
    unit: product.unit,
  }));

  const paymentSettings = store.paymentSettings;

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
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-black"
            style={{ color: store.primaryColor }}
          >
            <ArrowLeft size={17} />
            Kembali ke keranjang
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Checkout Pesanan
              </h1>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Lengkapi data pembeli, validasi nomor WhatsApp, lalu pilih
                metode pembayaran.
              </p>
            </div>

            <div
              className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black"
              style={{ backgroundColor: '#FFF1E6', color: store.accentColor }}
            >
              <ShieldCheck size={17} />
              Checkout Aman
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_390px]">
        <CheckoutClient
          products={safeProducts}
          subdomain={store.subdomain}
          primaryColor={store.primaryColor}
          accentColor={store.accentColor}
          paymentSettings={store.paymentSettings}
        />
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

function CheckoutStep({
  number,
  title,
  subtitle,
  children,
  primaryColor,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  primaryColor: string;
}) {
  return (
    <section className="rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {number}
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#102033]">
            {title}
          </h2>

          <p className="mt-1 text-sm font-semibold leading-7 text-[#64748B]">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function InputBox({
  id,
  icon,
  label,
  placeholder,
  primaryColor,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  placeholder: string;
  primaryColor: string;
}) {
  return (
    <label className="block rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4">
      <div className="flex items-center gap-2" style={{ color: primaryColor }}>
        {icon}
        <p className="text-xs font-black uppercase tracking-wide">
          {label}
        </p>
      </div>

      <input
        id={id}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent text-sm font-bold text-[#102033] outline-none placeholder:text-[#94A3B8]"
      />
    </label>
  );
}

function PaymentCard({
  id,
  method,
  icon,
  title,
  subtitle,
  enabled,
  primaryColor,
}: {
  id: string;
  method: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  enabled: boolean;
  primaryColor: string;
}) {
  return (
    <button
      id={id}
      data-payment-method={method}
      disabled={!enabled}
      className="payment-card rounded-[26px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div
        className="payment-icon flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: '#F1F5F9',
          color: '#64748B',
        }}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-black text-[#102033]">
        {title}
      </h3>

      <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
        {subtitle}
      </p>

      <span className="hidden" data-primary-color={primaryColor} />
    </button>
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
            Toko belum tersedia untuk menerima checkout online.
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

function CheckoutScript({
  products,
  primaryColor,
  paymentSettings,
}: {
  products: Array<{
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
    price: number;
    stockQty: number;
    stockEnabled: boolean;
    isOutOfStock: boolean;
    unit: string;
  }>;
  primaryColor: string;
  paymentSettings: {
    transferEnabled: boolean;
    qrisEnabled: boolean;
    paymentProofRequired: boolean;
  };
}) {
  const script = `
(function () {
  const CART_KEY = 'talase_cart';
  const CHECKOUT_KEY = 'talase_checkout_draft';
  const products = ${JSON.stringify(products)};
  const primaryColor = ${JSON.stringify(primaryColor)};
  const paymentSettings = ${JSON.stringify(paymentSettings)};
  let selectedPaymentMethod = paymentSettings.transferEnabled
    ? 'transfer'
    : paymentSettings.qrisEnabled
      ? 'qris'
      : '';
  let waVerified = false;

  function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function normalizeCart(cart) {
    return cart
      .map((item) => {
        const product = products.find((p) => p.slug === item.slug || p.id === item.id);
        if (!product || product.isOutOfStock) return null;

        const maxQty = product.stockEnabled ? Math.max(product.stockQty, 1) : 999;
        const qty = Math.min(Math.max(Number(item.qty || 1), 1), maxQty);

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          qty,
          note: typeof item.note === 'string' ? item.note : ''
        };
      })
      .filter(Boolean);
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

  function getValue(id) {
    const el = document.getElementById(id);
    return el && 'value' in el ? String(el.value || '').trim() : '';
  }

  function renderItems() {
    const cart = normalizeCart(readCart());
    const itemsEl = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const discountEl = document.getElementById('checkout-discount');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');
    const createButton = document.getElementById('create-order-button');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = 0;
    const shippingCost = 0;
    const total = subtotal - discount + shippingCost;

    if (itemsEl) {
      if (!cart.length) {
        itemsEl.innerHTML = \`
          <div class="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
            <p class="text-sm font-black text-[#102033]">Keranjang kosong</p>
            <p class="mt-2 text-xs font-semibold leading-6 text-[#64748B]">Silakan pilih produk terlebih dahulu.</p>
            <a href="/products" class="mt-4 inline-flex rounded-xl px-4 py-3 text-xs font-black text-white" style="background:\${primaryColor}">Lihat Produk</a>
          </div>
        \`;
      } else {
        itemsEl.innerHTML = cart.map((item) => \`
          <div class="grid grid-cols-[58px_1fr_auto] gap-3 rounded-2xl bg-[#F8FAFC] p-3">
            <a href="/products/\${item.slug}" class="relative block aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]">
              <img src="\${item.imageUrl}" alt="\${item.name}" class="h-full w-full object-cover" />
            </a>

            <div>
              <a href="/products/\${item.slug}">
                <h3 class="line-clamp-2 text-sm font-black text-[#102033]">\${item.name}</h3>
              </a>
              <p class="mt-1 text-xs font-bold text-[#64748B]">\${item.qty} x \${formatCurrency(item.price)}</p>
              \${item.note ? '<p class="mt-1 line-clamp-1 text-[11px] font-semibold text-[#94A3B8]">Catatan: ' + item.note + '</p>' : ''}
            </div>

            <p class="text-right text-sm font-black text-[#102033]">\${formatCurrency(item.price * item.qty)}</p>
          </div>
        \`).join('');
      }
    }

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (discountEl) discountEl.textContent = '- ' + formatCurrency(discount);
    if (shippingEl) shippingEl.textContent = shippingCost > 0 ? formatCurrency(shippingCost) : 'Diatur toko';
    if (totalEl) totalEl.textContent = formatCurrency(total);

    if (createButton) {
      createButton.disabled = !cart.length || !selectedPaymentMethod;
      createButton.style.opacity = cart.length && selectedPaymentMethod ? '1' : '0.5';
      createButton.style.cursor = cart.length && selectedPaymentMethod ? 'pointer' : 'not-allowed';
    }
  }

  function selectPayment(method) {
    if (method === 'transfer' && !paymentSettings.transferEnabled) return;
    if (method === 'qris' && !paymentSettings.qrisEnabled) return;

    selectedPaymentMethod = method;

    document.querySelectorAll('.payment-card').forEach((button) => {
      const isActive = button.getAttribute('data-payment-method') === method;
      const icon = button.querySelector('.payment-icon');

      button.style.borderColor = isActive ? primaryColor : '#E2E8F0';
      button.style.backgroundColor = isActive ? '#F8FAFC' : '#FFFFFF';

      if (icon) {
        icon.style.backgroundColor = isActive ? primaryColor : '#F1F5F9';
        icon.style.color = isActive ? '#FFFFFF' : '#64748B';
      }
    });
  }

  function validateCheckout(cart) {
    const name = getValue('customer-name');
    const phone = getValue('customer-phone');
    const address = getValue('customer-address');

    if (!cart.length) return 'Keranjang masih kosong.';
    if (!name) return 'Nama pembeli wajib diisi.';
    if (!phone) return 'Nomor WhatsApp wajib diisi.';
    if (!address) return 'Alamat lengkap wajib diisi.';
    if (!selectedPaymentMethod) return 'Pilih metode pembayaran terlebih dahulu.';
    if (!waVerified) return 'Nomor WhatsApp harus diverifikasi OTP terlebih dahulu.';

    return '';
  }

  function bindEvents() {
    document.querySelectorAll('.payment-card').forEach((button) => {
      button.addEventListener('click', () => {
        const method = button.getAttribute('data-payment-method') || '';
        selectPayment(method);
      });
    });

    const sendOtp = document.getElementById('send-otp-button');
    if (sendOtp) {
      sendOtp.addEventListener('click', () => {
        const phone = getValue('customer-phone');
        if (!phone) {
          setMessage('otp-message', 'Isi nomor WhatsApp terlebih dahulu.', 'error');
          return;
        }

        setMessage(
          'otp-message',
          'OTP siap dikirim melalui Cloud Function requestCustomerCheckoutOtp. Integrasi function disambungkan pada step backend.',
          'success'
        );
      });
    }

    const verifyOtp = document.getElementById('verify-otp-button');
    if (verifyOtp) {
      verifyOtp.addEventListener('click', () => {
        const otp = getValue('otp-code');
        if (!otp || otp.length < 4) {
          setMessage('otp-message', 'Masukkan kode OTP yang valid.', 'error');
          return;
        }

        waVerified = true;
        setMessage(
          'otp-message',
          'Nomor WhatsApp ditandai terverifikasi untuk draft checkout ini.',
          'success'
        );
      });
    }

    const createButton = document.getElementById('create-order-button');
    if (createButton) {
      createButton.addEventListener('click', () => {
        const cart = normalizeCart(readCart());
        const validationError = validateCheckout(cart);

        if (validationError) {
          setMessage('checkout-message', validationError, 'error');
          return;
        }

        const orderCode = 'TLS-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const discount = 0;
        const shippingCost = 0;
        const total = subtotal - discount + shippingCost;

        const draft = {
          orderCode,
          customerName: getValue('customer-name'),
          customerPhone: getValue('customer-phone'),
          customerAddress: getValue('customer-address'),
          customerNote: getValue('customer-note'),
          waVerified,
          paymentMethod: selectedPaymentMethod,
          paymentStatus: 'waiting_confirmation',
          orderStatus: 'new',
          subtotal,
          discount,
          shippingCost,
          total,
          items: cart,
          createdAt: new Date().toISOString(),
          paymentProofRequired: paymentSettings.paymentProofRequired
        };

        localStorage.setItem(CHECKOUT_KEY, JSON.stringify(draft));
        window.location.href = '/payment/' + encodeURIComponent(orderCode);
      });
    }
  }

  renderItems();
  selectPayment(selectedPaymentMethod);
  bindEvents();
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}