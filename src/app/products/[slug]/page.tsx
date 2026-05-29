import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';
import { ProductDetailActions } from './product-detail-actions';

import {
  getPublicProductDetail,
  resolveSubdomain,
  type StoreProduct,
} from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const { store, product, relatedProducts } =
    await getPublicProductDetail(subdomain, slug);

  if (store.resolveStatus !== 'ready') {
    return <StoreStatusPage store={store} />;
  }

  if (!product) {
    return <ProductNotFoundPage store={store} />;
  }

  const isOutOfStock = product.isOutOfStock;
  const galleryImages = buildGalleryImages(product);
  const cartHref = isOutOfStock
    ? `/products/${product.slug}`
    : `/cart?add=${encodeURIComponent(product.slug)}`;

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
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#64748B]">
            <Link
              href="/"
              className="transition"
              style={{ color: store.primaryColor }}
            >
              Beranda
            </Link>
            <ChevronRight size={15} />
            <Link
              href="/products"
              className="transition"
              style={{ color: store.primaryColor }}
            >
              Produk
            </Link>
            <ChevronRight size={15} />
            <Link
              href={`/category/${product.categorySlug}`}
              className="transition"
              style={{ color: store.primaryColor }}
            >
              {product.category}
            </Link>
            <ChevronRight size={15} />
            <span className="line-clamp-1 text-[#102033]">
              {product.name}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black"
          style={{ color: store.primaryColor }}
        >
          <ArrowLeft size={17} />
          Kembali ke semua produk
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="overflow-hidden rounded-[34px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[#F1F5F9]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className={`object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                priority
              />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {product.promoLabel && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg"
                    style={{ backgroundColor: store.accentColor }}
                  >
                    <Tag size={13} />
                    {product.promoLabel}
                  </span>
                )}

                {product.isFeatured && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg"
                    style={{ backgroundColor: store.primaryColor }}
                  >
                    <Star size={13} fill="currentColor" />
                    Unggulan
                  </span>
                )}

                {isOutOfStock && (
                  <span className="rounded-full bg-[#E60046] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                    Habis
                  </span>
                )}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {galleryImages.slice(0, 3).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[34px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide"
              style={{
                backgroundColor: '#FFF1E6',
                color: store.accentColor,
              }}
            >
              <Sparkles size={14} />
              {product.category}
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-[#102033] md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <Star size={16} fill="currentColor" className="text-[#FACC15]" />
                {product.rating}
              </span>

              {product.sold > 0 && <span>Terjual {product.sold}</span>}

              <span>
                Stok:{' '}
                <strong
                  className={isOutOfStock ? 'text-[#E60046]' : ''}
                  style={!isOutOfStock ? { color: store.primaryColor } : undefined}
                >
                  {product.stockEnabled
                    ? isOutOfStock
                      ? 'Habis'
                      : `${product.stockQty} ${product.unit || 'pcs'}`
                    : 'Tersedia'}
                </strong>
              </span>
            </div>

            <div className="mt-6 rounded-[26px] bg-[#F8FAFC] p-5">
              <p
                className="text-4xl font-black"
                style={{ color: store.primaryColor }}
              >
                {formatCurrency(
                  product.hasDiscount &&
                    product.discountPrice > 0 &&
                    product.discountPrice < product.sellingPrice
                    ? product.discountPrice
                    : product.sellingPrice || product.price,
                )}
              </p>

              {product.hasDiscount &&
                product.discountPrice > 0 &&
                product.discountPrice < product.sellingPrice && (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="text-sm font-bold text-[#94A3B8] line-through">
                    {formatCurrency(product.sellingPrice)}
                  </p>

                  <span
                    className="rounded-full px-3 py-1 text-xs font-black"
                    style={{
                      backgroundColor: '#FFF1E6',
                      color: store.accentColor,
                    }}
                  >
                    Hemat{' '}
                    {formatCurrency(product.sellingPrice - product.discountPrice)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-black text-[#102033]">
                Deskripsi Produk
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-8 text-[#64748B] md:text-base">
                {product.description ||
                  'Produk ini tersedia di website toko dan dapat dipesan secara online.'}
              </p>
            </div>

            <ProductDetailActions
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.imageUrl,
                price: product.hasDiscount ? product.discountPrice : product.sellingPrice,
                originalPrice: product.sellingPrice,
                sellingPrice: product.sellingPrice,
                discountPrice: product.discountPrice,
                hasDiscount: product.hasDiscount,
                stockQty: product.stockQty,
                stockEnabled: product.stockEnabled,
                isOutOfStock: product.isOutOfStock,
                unit: product.unit,
              }}
              storeName={store.businessName}
              formattedPrice={formatCurrency(product.price)}
              primaryColor={store.primaryColor}
            />

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<ShieldCheck size={20} />}
                title="Aman"
                subtitle="Pesanan tercatat"
                primaryColor={store.primaryColor}
              />

              <InfoCard
                icon={<Truck size={20} />}
                title="Diproses"
                subtitle="Langsung oleh kami"
                primaryColor={store.primaryColor}
              />

              <InfoCard
                icon={<ShoppingBag size={20} />}
                title="Mudah"
                subtitle="Checkout online"
                primaryColor={store.primaryColor}
              />
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">
                Produk Terkait
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#64748B]">
                Produk lain dari kategori yang sama.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-black md:inline-flex"
              style={{ color: store.primaryColor }}
            >
              Lihat Semua
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <RelatedProductCard
                key={item.id}
                product={item}
                primaryColor={store.primaryColor}
                accentColor={store.accentColor}
              />
            ))}
          </div>
        </section>
      )}

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

function InfoCard({
  icon,
  title,
  subtitle,
  primaryColor,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
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

      <h3 className="mt-3 text-sm font-black text-[#102033]">
        {title}
      </h3>

      <p className="mt-1 text-xs font-bold text-[#64748B]">
        {subtitle}
      </p>
    </div>
  );
}

function RelatedProductCard({
  product,
  primaryColor,
  accentColor,
}: {
  product: StoreProduct;
  primaryColor: string;
  accentColor: string;
}) {
  const isOutOfStock = product.isOutOfStock;

  const originalPrice = Number(product.sellingPrice || product.originalPrice || product.price || 0);
  const discountPrice = Number(product.discountPrice || 0);
  const hasDiscount =
    product.hasDiscount === true &&
    discountPrice > 0 &&
    discountPrice < originalPrice;
  const finalPrice = hasDiscount ? discountPrice : Number(product.price || originalPrice);

  return (
    <div className="group overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#F1F5F9]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition duration-500 group-hover:scale-110 ${
              isOutOfStock ? 'grayscale' : ''
            }`}
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.promoLabel && (
              <span
                className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                {product.promoLabel}
              </span>
            )}

            {isOutOfStock && (
              <span className="rounded-full bg-[#E60046] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                Habis
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/category/${product.categorySlug}`}>
          <p
            className="text-xs font-black uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            {product.category}
          </p>
        </Link>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[42px] text-sm font-black leading-5 text-[#102033] transition md:text-base">
            {product.name}
          </h3>
        </Link>

        <p className="mt-3 text-lg font-black text-[#102033]">
          {formatCurrency(finalPrice)}
        </p>

        {hasDiscount && (
          <p className="mt-1 text-xs font-bold text-[#94A3B8] line-through">
            {formatCurrency(originalPrice)}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-[#64748B]">
          <span className="flex items-center gap-1">
            <Star size={13} fill="currentColor" className="text-[#FACC15]" />
            {product.rating}
          </span>

          <span>
            {product.stockEnabled
              ? product.isOutOfStock
                ? 'Habis'
                : `Stok ${product.stockQty}`
              : product.unit || 'Tersedia'}
          </span>
        </div>
      </div>
    </div>
  );
}

function StoreStatusPage({
  store,
}: {
  store: Awaited<ReturnType<typeof import('@/lib/store-resolver').getStorefrontData>>;
}) {
  const title =
    store.resolveStatus === 'not_found'
      ? 'Toko tidak ditemukan'
      : store.resolveStatus === 'inactive'
        ? 'Toko sedang tidak aktif'
        : 'Website toko belum dipublish';

  const description =
    store.resolveStatus === 'not_found'
      ? 'Subdomain toko yang Anda buka belum terdaftar atau belum tersedia.'
      : store.resolveStatus === 'inactive'
        ? 'Website toko ini sedang tidak aktif. Silakan hubungi pemilik toko.'
        : 'Pemilik toko belum mengaktifkan publikasi website ecommerce.';

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
            {description}
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#073B70] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
          >
            Kembali
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}

function ProductNotFoundPage({
  store,
}: {
  store: Awaited<ReturnType<typeof import('@/lib/store-resolver').getStorefrontData>>;
}) {
  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#102033]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
        contentType={store.contentType}
        logoUrl={store.logoUrl}
      />

      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-12">
        <div className="w-full rounded-[34px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFF1E6] text-[#FF7A1A]">
            <PackageSearch size={30} />
          </div>

          <h1 className="mt-6 text-3xl font-black md:text-4xl">
            Produk tidak ditemukan
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-[#64748B] md:text-base">
            Produk yang Anda buka tidak tersedia, belum dipublish, atau sudah
            dinonaktifkan oleh toko.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
            style={{ backgroundColor: store.primaryColor }}
          >
            Lihat Produk Lain
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

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

      <AddToCartScript
        products={store.products.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          imageUrl: item.imageUrl,
          price: item.price,
          stockQty: item.stockQty,
          stockEnabled: item.stockEnabled,
          isOutOfStock: item.isOutOfStock,
          unit: item.unit,
        }))}
      />
    </main>
  );
}

function buildGalleryImages(product: StoreProduct): string[] {
  const images = [
    product.imageUrl,
    ...product.imageUrls,
    ...product.secondaryImageUrls,
  ].filter(Boolean);

  return Array.from(new Set(images));
}

function AddToCartScript({
  products,
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
}) {
  const script = `
(function () {
  const CART_KEY = 'talase_cart';
  const products = ${JSON.stringify(products)};

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('talase-cart-updated'));
  }

  function getQty() {
    const el = document.getElementById('product-qty');
    const qty = Number(el ? el.textContent : '1');
    return Math.max(qty || 1, 1);
  }

  function setQty(value) {
    const el = document.getElementById('product-qty');
    if (!el) return;
    el.textContent = String(Math.max(Number(value) || 1, 1));
  }

  function addToCart(slug, qty) {
    const product = products.find((p) => p.slug === slug || p.id === slug);
    if (!product || product.isOutOfStock) return;

    const cart = readCart();
    const existing = cart.find((item) => item.slug === product.slug || item.id === product.id);

    const addQty = Math.max(Number(qty || 1), 1);
    const maxQty = product.stockEnabled ? Math.max(product.stockQty, 1) : 999;

    if (existing) {
      existing.qty = Math.min(Number(existing.qty || 1) + addQty, maxQty);
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
        qty: Math.min(addQty, maxQty),
        note: ''
      });
    }

    saveCart(cart);
  }

  document.querySelectorAll('[data-qty-minus]').forEach((button) => {
    button.addEventListener('click', function () {
      setQty(getQty() - 1);
    });
  });

  document.querySelectorAll('[data-qty-plus]').forEach((button) => {
    button.addEventListener('click', function () {
      setQty(getQty() + 1);
    });
  });

  document.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      const slug = this.getAttribute('data-add-cart');
      if (!slug) return;

      addToCart(slug, getQty());
      window.location.href = '/cart';
    });
  });

  document.querySelectorAll('[data-share-product]').forEach((button) => {
    button.addEventListener('click', async function () {
      const title = this.getAttribute('data-share-title') || 'Produk';
      const price = this.getAttribute('data-share-price') || '';
      const store = this.getAttribute('data-share-store') || 'Toko';
      const url = window.location.href;

      const text =
        title + '\\n' +
        price + '\\n\\n' +
        'Cek produk ini di ' + store + ':\\n' +
        url;

      try {
        localStorage.setItem('talase_last_shared_product', JSON.stringify({
          title,
          price,
          store,
          url,
          text,
          sharedAt: new Date().toISOString()
        }));

        if (navigator.share) {
          await navigator.share({
            title: title,
            text: text,
            url: url
          });
          return;
        }

        await navigator.clipboard.writeText(text);
        alert('Link produk berhasil disalin.');
      } catch (_) {
        alert('Gagal membagikan produk.');
      }
    });
  });
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}