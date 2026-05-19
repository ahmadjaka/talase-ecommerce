import {
  ProductCard,
  type ProductCardItem,
} from '@/components/product/product-card';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
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
  getStorefrontData,
  resolveSubdomain,
  type StoreProduct,
} from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';
import { ProductsClient } from './products-client';

export default async function ProductsPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStorefrontData(subdomain);

  if (store.resolveStatus !== 'ready') {
    return <StoreStatusPage store={store} />;
  }

  const products = store.products;
  const featuredProducts =
    store.featuredProducts.length > 0
      ? store.featuredProducts
      : products.filter((product) => product.isFeatured);

  const fallbackFeaturedProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : products
          .filter((product) => !product.isOutOfStock)
          .slice(0, 8);

  const categories = [
    {
      id: 'all',
      slug: 'all',
      name: 'Semua',
    },
    ...store.categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
    })),
  ];

  const activePromoCount = store.promotions.length;

    const productGridClass = resolveProductGridClass(store.productGrid);

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
        facebookUrl={store.facebookUrl}
        instagramUrl={store.instagramUrl}
        tiktokUrl={store.tiktokUrl}
        whatsappUrl={store.whatsapp}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#64748B]">
            <Link href="/" style={{ color: store.primaryColor }}>
              Beranda
            </Link>

            <ChevronRight size={15} />

            <span className="text-[#102033]">
              Semua Produk
            </span>
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
        }))}
        primaryColor={store.primaryColor}
        accentColor={store.accentColor}
        cardStyle={store.productCardStyle}
      />

      {fallbackFeaturedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">
                Produk Unggulan
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#64748B]">
                Produk pilihan yang ditampilkan khusus oleh toko.
              </p>
            </div>

            <div
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide md:inline-flex"
              style={{
                backgroundColor: '#FFF1E6',
                color: store.accentColor,
              }}
            >
              <Star size={14} fill="currentColor" />
              Recommended
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {fallbackFeaturedProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={{
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
                }}
                primaryColor={store.primaryColor}
                accentColor={store.accentColor}
                cardStyle={store.productCardStyle}
                highlight
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

function EmptyProducts({
  primaryColor,
}: {
  primaryColor: string;
}) {
  return (
    <div className="rounded-[34px] border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <PackageSearch size={30} />
      </div>

      <h3 className="mt-6 text-2xl font-black text-[#102033]">
        Produk belum tersedia
      </h3>

      <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-7 text-[#64748B]">
        Toko ini belum memiliki produk yang dipublish ke website ecommerce.
      </p>
    </div>
  );
}

function resolveProductGridClass(productGrid: string) {
  if (productGrid === 'compact_grid') {
    return 'grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5';
  }

  if (productGrid === 'wide_grid') {
    return 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3';
  }

  if (productGrid === 'carousel') {
    return 'flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:w-[220px] [&>*]:shrink-0 md:[&>*]:w-[260px]';
  }

  return 'grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4';
}

function resolveProductCardClass(cardStyle: string) {
  if (cardStyle === 'minimal_card') {
    return 'group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl';
  }

  if (cardStyle === 'image_focus_card') {
    return 'group overflow-hidden rounded-[34px] border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl';
  }

  if (cardStyle === 'compact_card') {
    return 'group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg';
  }

  if (cardStyle === 'classic_card') {
    return 'group overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl';
  }

  return 'group overflow-hidden rounded-[28px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl';
}

function resolveProductImageClass(cardStyle: string) {
  if (cardStyle === 'image_focus_card') {
    return 'relative aspect-[4/5] overflow-hidden bg-[#F1F5F9]';
  }

  if (cardStyle === 'compact_card') {
    return 'relative aspect-[1.15/1] overflow-hidden bg-[#F1F5F9]';
  }

  return 'relative aspect-square overflow-hidden bg-[#F1F5F9]';
}
