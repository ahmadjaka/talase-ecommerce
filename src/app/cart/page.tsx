import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ArrowRight,
  PackageSearch,
  ShoppingBag,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import {
  getStorefrontData,
  resolveSubdomain,
} from '@/lib/store-resolver';

import { CartClient } from './cart-client';

export default async function CartPage({
  searchParams,
}: {
  searchParams?: Promise<{ add?: string }>;
}) {
  const query = searchParams ? await searchParams : {};
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

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#102033]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
        contentType={store.contentType}
        logoUrl={store.logoUrl}
        primaryColor={store.primaryColor}
        secondaryColor={store.secondaryColor}
        accentColor={store.accentColor}
        facebookUrl={store.facebookUrl}
        instagramUrl={store.instagramUrl}
        tiktokUrl={store.tiktokUrl}
        whatsappUrl={store.whatsapp}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-black"
            style={{ color: store.primaryColor }}
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

            <div
              id="cart-count-badge"
              className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black"
              style={{ backgroundColor: '#FFF1E6', color: store.accentColor }}
            >
              <ShoppingBag size={17} />
              0 Item
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_380px]">
        <CartClient
          products={safeProducts}
          primaryColor={store.primaryColor}
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
            Toko belum tersedia untuk menerima pesanan online.
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

function CartScript({
  products,
  addSlug,
  primaryColor,
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
  addSlug: string;
  primaryColor: string;
}) {
  const script = `
(function () {
  const CART_KEY = 'talase_cart';
  const products = ${JSON.stringify(products)};
  const addSlug = ${JSON.stringify(addSlug)};
  const primaryColor = ${JSON.stringify(primaryColor)};

  function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function readCart() {
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      const parsedCart = rawCart ? JSON.parse(rawCart) : [];

      if (Array.isArray(parsedCart) && parsedCart.length > 0) {
        return parsedCart;
      }

      const rawDraft = localStorage.getItem('talase_checkout_draft');
      const parsedDraft = rawDraft ? JSON.parse(rawDraft) : null;

      if (parsedDraft && Array.isArray(parsedDraft.items)) {
        return parsedDraft.items;
      }

      const orderKeys = Object.keys(localStorage)
        .filter((key) => key.startsWith('talase_order_'))
        .sort()
        .reverse();

      for (const key of orderKeys) {
        const rawOrder = localStorage.getItem(key);
        const parsedOrder = rawOrder ? JSON.parse(rawOrder) : null;

        if (parsedOrder && Array.isArray(parsedOrder.items)) {
          return parsedOrder.items;
        }
      }

      return [];
    } catch (_) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('talase-cart-updated'));
  }

  function normalizeCart(cart) {
    return cart
      .map((item) => {
        const product = products.find(
          (p) => p.slug === item.slug || p.id === item.id
        );

        const source = product || item;

        if (!source || source.isOutOfStock) return null;

        const stockEnabled = source.stockEnabled === true;
        const stockQty = Number(source.stockQty || item.stockQty || 0);
        const maxQty = stockEnabled ? Math.max(stockQty, 1) : 999;
        const qty = Math.min(Math.max(Number(item.qty || 1), 1), maxQty);

        return {
          id: source.id || item.id || source.slug || item.slug,
          slug: source.slug || item.slug,
          name: source.name || item.name || 'Produk',
          imageUrl: source.imageUrl || item.imageUrl || '',
          price: Number(source.price || item.price || 0),
          stockQty,
          stockEnabled,
          unit: source.unit || item.unit || '',
          qty,
          note: typeof item.note === 'string' ? item.note : ''
        };
      })
      .filter(Boolean)
      .filter((item) => item.slug && item.price > 0);
  }

  function addProductFromQuery() {
    if (!addSlug) return;

    const product = products.find(
      (p) => p.slug === addSlug || p.slug === decodeURIComponent(addSlug)
    );
    if (!product || product.isOutOfStock) return;

    const cart = normalizeCart(readCart());
    const existing = cart.find((item) => item.slug === product.slug);

    if (existing) {
      const maxQty = product.stockEnabled ? Math.max(product.stockQty, 1) : 999;
      existing.qty = Math.min(existing.qty + 1, maxQty);
    } else {
      cart.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        stockQty: product.stockQty,
        stockEnabled: product.stockEnabled,
        unit: product.unit,
        qty: 1,
        note: ''
      });
    }

    saveCart(cart);

    if (window.history && window.location.search.includes('add=')) {
      window.history.replaceState({}, '', '/cart');
    }
  }

  function changeQty(slug, delta) {
    const cart = normalizeCart(readCart());
    const item = cart.find((row) => row.slug === slug);
    if (!item) return;

    const maxQty = item.stockEnabled ? Math.max(item.stockQty, 1) : 999;
    item.qty = Math.min(Math.max(item.qty + delta, 1), maxQty);
    saveCart(cart);
    render();
  }

  function removeItem(slug) {
    const cart = normalizeCart(readCart()).filter((item) => item.slug !== slug);
    saveCart(cart);
    render();
  }

  function updateNote(slug, value) {
    const cart = normalizeCart(readCart());
    const item = cart.find((row) => row.slug === slug);
    if (!item) return;

    item.note = value;
    saveCart(cart);
  }

  function renderEmpty() {
    return \`
      <div class="rounded-[30px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F1F5F9] text-[#94A3B8]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <h2 class="mt-5 text-xl font-black text-[#102033]">Keranjang masih kosong</h2>
        <p class="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-[#64748B]">
          Pilih produk dari katalog toko untuk mulai membuat pesanan.
        </p>
        <a href="/products" class="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg" style="background:\${primaryColor}">
          Lihat Produk
        </a>
      </div>
    \`;
  }

  function renderItem(item) {
    return \`
      <div class="rounded-[30px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5">
        <div class="grid gap-4 md:grid-cols-[130px_1fr_auto] md:items-center">
          <a href="/products/\${item.slug}" class="relative block aspect-square overflow-hidden rounded-[24px] bg-[#F1F5F9]">
            \${item.imageUrl
              ? '<img src="' + item.imageUrl + '" alt="' + item.name + '" class="h-full w-full object-cover" />'
              : '<div class="flex h-full w-full items-center justify-center text-[#94A3B8]">Produk</div>'
            }
          </a>

          <div>
            <a href="/products/\${item.slug}">
              <h2 class="text-lg font-black text-[#102033] transition md:text-xl">\${item.name}</h2>
            </a>

            <p class="mt-2 text-xl font-black" style="color:\${primaryColor}">
              \${formatCurrency(item.price)}
            </p>

            <div class="mt-4 rounded-2xl bg-[#F8FAFC] px-4 py-3">
              <p class="text-xs font-black uppercase tracking-wide text-[#94A3B8]">Catatan Item</p>
              <input
                data-note="\${item.slug}"
                value="\${item.note || ''}"
                placeholder="Contoh: warna, ukuran, level pedas, dll"
                class="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#64748B] outline-none"
              />
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 md:flex-col md:items-end">
            <div class="inline-flex h-12 items-center rounded-2xl border border-[#E2E8F0] bg-white px-3">
              <button data-minus="\${item.slug}" class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B]">−</button>
              <span class="mx-5 text-sm font-black">\${item.qty}</span>
              <button data-plus="\${item.slug}" class="flex h-8 w-8 items-center justify-center rounded-xl text-white" style="background:\${primaryColor}">+</button>
            </div>

            <div class="text-right">
              <p class="text-xs font-bold text-[#94A3B8]">Subtotal</p>
              <p class="mt-1 text-lg font-black text-[#102033]">\${formatCurrency(item.price * item.qty)}</p>
            </div>

            <button data-remove="\${item.slug}" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1F1] text-[#E60046] transition hover:scale-[1.04]">
              🗑
            </button>
          </div>
        </div>
      </div>
    \`;
  }

  function render() {
    const cart = normalizeCart(readCart());

    if (cart.length > 0) {
      saveCart(cart);
    }

    const itemsEl = document.getElementById('cart-items');
    const badgeEl = document.getElementById('cart-count-badge');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = 0;
    const total = Math.max(subtotal - discount, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

    if (itemsEl) {
      itemsEl.innerHTML = cart.length ? cart.map(renderItem).join('') : renderEmpty();
    }

    if (badgeEl) badgeEl.innerHTML = '<span>🛍</span>' + itemCount + ' Item';
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (discountEl) discountEl.textContent = '- ' + formatCurrency(discount);
    if (totalEl) totalEl.textContent = formatCurrency(total);

    if (checkoutButton) {
      checkoutButton.style.pointerEvents = cart.length ? 'auto' : 'none';
      checkoutButton.style.opacity = cart.length ? '1' : '0.5';
    }

    document.querySelectorAll('[data-minus]').forEach((button) => {
      button.addEventListener('click', () => changeQty(button.getAttribute('data-minus'), -1));
    });

    document.querySelectorAll('[data-plus]').forEach((button) => {
      button.addEventListener('click', () => changeQty(button.getAttribute('data-plus'), 1));
    });

    document.querySelectorAll('[data-remove]').forEach((button) => {
      button.addEventListener('click', () => removeItem(button.getAttribute('data-remove')));
    });

    document.querySelectorAll('[data-note]').forEach((input) => {
      input.addEventListener('input', () => updateNote(input.getAttribute('data-note'), input.value));
    });
  }

  addProductFromQuery();
  render();
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}