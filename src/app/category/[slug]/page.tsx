import {
  ProductCard,
} from '@/components/product/product-card';
import { ProductsClient } from '@/app/products/products-client';

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

      <ProductsClient
        products={products.map((product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          originalPrice: product.originalPrice,
          sold: product.sold,
          rating: product.rating,
          category: product.category,
          categorySlug: product.categorySlug,
          promoLabel: product.promoLabel,
          stockQty: product.stockQty,
          stockEnabled: product.stockEnabled,
          isOutOfStock: product.isOutOfStock,
        }))}
        primaryColor={store.primaryColor}
        accentColor={store.accentColor}
        cardStyle={store.productCardStyle}
        title={`Produk ${category.name}`}
        subtitle="Katalog produk yang tersedia pada kategori ini."
        searchPlaceholder={`Cari produk kategori ${category.name}...`}
      />

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