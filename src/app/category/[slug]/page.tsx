import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Filter,
  Grid3X3,
  PackageSearch,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import {
  getPublicCategoryData,
  resolveSubdomain,
  type StoreProduct,
} from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const { store, category, products } =
    await getPublicCategoryData(subdomain, slug);

  if (store.resolveStatus !== 'ready') {
    return <StoreStatusPage store={store} />;
  }

  if (!category) {
    return <CategoryNotFoundPage store={store} />;
  }

  const otherCategories = store.categories.filter(
    (item) => item.slug !== category.slug,
  );

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#102033]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
        contentType={store.contentType}
        logoUrl={store.logoUrl}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#64748B]">
            <Link href="/" style={{ color: store.primaryColor }}>
              Beranda
            </Link>
            <ChevronRight size={15} />
            <Link href="/products" style={{ color: store.primaryColor }}>
              Produk
            </Link>
            <ChevronRight size={15} />
            <span className="text-[#102033]">{category.name}</span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${store.primaryColor}, ${store.secondaryColor})`,
          }}
        />

        <div className="absolute inset-0 opacity-20">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
          <Link
            href="/products"
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft size={17} />
            Semua Produk
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-white backdrop-blur-md md:text-sm">
                <Sparkles size={16} />
                Kategori Produk
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
                {category.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
                {category.description ||
                  `Jelajahi produk kategori ${category.name} dari ${store.businessName}.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SummaryCard title="Produk" value={`${products.length}`} />
              <SummaryCard title="Status" value="Publish" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
              <Search size={18} className="text-[#64748B]" />
              <span className="text-sm font-bold text-[#94A3B8]">
                Cari produk kategori {category.name}...
              </span>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-black text-[#102033] transition hover:bg-[#F8FAFC]">
              <Filter size={17} />
              Filter
            </button>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.01]"
              style={{ backgroundColor: store.primaryColor }}
            >
              <SlidersHorizontal size={17} />
              Urutkan
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              Produk {category.name}
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#64748B]">
              Katalog produk yang tersedia pada kategori ini.
            </p>
          </div>

          <div
            className="hidden items-center gap-2 text-sm font-black md:inline-flex"
            style={{ color: store.primaryColor }}
          >
            <Grid3X3 size={16} />
            {products.length} Produk
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                primaryColor={store.primaryColor}
                accentColor={store.accentColor}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F1F5F9] text-[#94A3B8]">
              <ShoppingBag size={28} />
            </div>

            <h3 className="mt-5 text-xl font-black text-[#102033]">
              Produk belum tersedia
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-[#64748B]">
              Produk pada kategori ini belum dipublish oleh toko.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg"
              style={{ backgroundColor: store.primaryColor }}
            >
              Lihat Semua Produk
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>

      {otherCategories.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">
                Kategori Lainnya
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#64748B]">
                Jelajahi kategori produk lain dari toko ini.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {otherCategories.map((item) => (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className="group overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[1.8/1] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-xl font-black text-white">
                      {item.name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs font-bold text-white/80">
                      {item.description ||
                        `Produk kategori ${item.name}`}
                    </p>
                  </div>
                </div>
              </Link>
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

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-wide text-white/70">
        {title}
      </p>

      <h3 className="mt-3 text-2xl font-black md:text-3xl">
        {value}
      </h3>
    </div>
  );
}

function ProductCard({
  product,
  primaryColor,
  accentColor,
}: {
  product: StoreProduct;
  primaryColor: string;
  accentColor: string;
}) {
  const isOutOfStock = product.isOutOfStock;
  const cartHref = isOutOfStock
    ? `/products/${product.slug}`
    : `/cart?add=${encodeURIComponent(product.slug)}`;

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
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                <Tag size={11} />
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
        <p
          className="text-xs font-black uppercase tracking-wide"
          style={{ color: primaryColor }}
        >
          {product.category}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[42px] text-sm font-black leading-5 text-[#102033] transition md:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3">
          <p className="text-lg font-black text-[#102033]">
            {formatCurrency(product.price)}
          </p>

          {product.originalPrice > product.price && (
            <p className="mt-1 text-xs font-bold text-[#94A3B8] line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>

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
              : product.sold > 0
                ? `Terjual ${product.sold}`
                : product.unit || 'Tersedia'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-[#E2E8F0] px-3 py-3 text-xs font-black text-[#102033] transition hover:bg-[#F8FAFC]"
          >
            Detail
            <ChevronRight size={14} />
          </Link>

          <Link
            href={cartHref}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition hover:scale-[1.04]"
            style={{
              backgroundColor: isOutOfStock ? '#94A3B8' : primaryColor,
            }}
            aria-label={
              isOutOfStock
                ? 'Produk habis'
                : `Tambah ${product.name} ke keranjang`
            }
          >
            <ShoppingBag size={17} />
          </Link>
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

function CategoryNotFoundPage({
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
        primaryColor={store.primaryColor}
        secondaryColor={store.secondaryColor}
        accentColor={store.accentColor}
      />

      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-12">
        <div className="w-full rounded-[34px] border border-[#E2E8F0] bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFF1E6] text-[#FF7A1A]">
            <PackageSearch size={30} />
          </div>

          <h1 className="mt-6 text-3xl font-black md:text-4xl">
            Kategori tidak ditemukan
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-[#64748B] md:text-base">
            Kategori yang Anda buka tidak tersedia atau belum dipublish oleh
            toko.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
            style={{ backgroundColor: store.primaryColor }}
          >
            Lihat Semua Produk
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
    </main>
  );
}