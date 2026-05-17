import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Filter,
  Grid3X3,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import { resolveSubdomain } from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

type Product = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  sold: number;
  rating: number;
  category: string;
  promoLabel: string;
  stockQty: number;
};

type Category = {
  slug: string;
  name: string;
  image: string;
  description: string;
};

async function getStoreData(subdomain: string | null) {
  const categories: Category[] = [
    {
      slug: 'makanan',
      name: 'Makanan',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      description: 'Pilihan makanan, snack, dan produk kuliner UMKM.',
    },
    {
      slug: 'minuman',
      name: 'Minuman',
      image:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      description: 'Minuman favorit, kopi, botol, dan produk segar.',
    },
    {
      slug: 'fashion',
      name: 'Fashion',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      description: 'Produk fashion harian dengan tampilan modern.',
    },
    {
      slug: 'aksesoris',
      name: 'Aksesoris',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
      description: 'Aksesoris pilihan untuk kebutuhan dan gaya harian.',
    },
  ];

  const products: Product[] = [
    {
      id: '1',
      slug: 'kopi-arabica-premium',
      name: 'Kopi Arabica Premium',
      imageUrl:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      price: 45000,
      originalPrice: 55000,
      sold: 128,
      rating: 4.9,
      category: 'Minuman',
      promoLabel: 'Promo',
      stockQty: 24,
    },
    {
      id: '2',
      slug: 'paket-snack-umkm',
      name: 'Paket Snack UMKM',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      price: 25000,
      originalPrice: 30000,
      sold: 87,
      rating: 4.8,
      category: 'Makanan',
      promoLabel: 'Best Seller',
      stockQty: 18,
    },
    {
      id: '3',
      slug: 'kaos-premium-talase',
      name: 'Kaos Premium Talase',
      imageUrl:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      price: 99000,
      originalPrice: 125000,
      sold: 42,
      rating: 5.0,
      category: 'Fashion',
      promoLabel: 'Unggulan',
      stockQty: 9,
    },
    {
      id: '4',
      slug: 'tumbler-eksklusif',
      name: 'Tumbler Eksklusif',
      imageUrl:
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
      price: 65000,
      originalPrice: 79000,
      sold: 63,
      rating: 4.7,
      category: 'Aksesoris',
      promoLabel: 'Diskon',
      stockQty: 12,
    },
    {
      id: '5',
      slug: 'cookies-homemade-premium',
      name: 'Cookies Homemade Premium',
      imageUrl:
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop',
      price: 38000,
      originalPrice: 45000,
      sold: 76,
      rating: 4.9,
      category: 'Makanan',
      promoLabel: 'Baru',
      stockQty: 31,
    },
    {
      id: '6',
      slug: 'tas-kanvas-simple',
      name: 'Tas Kanvas Simple',
      imageUrl:
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop',
      price: 89000,
      originalPrice: 109000,
      sold: 35,
      rating: 4.8,
      category: 'Fashion',
      promoLabel: 'Limited',
      stockQty: 7,
    },
    {
      id: '7',
      slug: 'es-kopi-susu-botol',
      name: 'Es Kopi Susu Botol',
      imageUrl:
        'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop',
      price: 18000,
      originalPrice: 22000,
      sold: 144,
      rating: 4.9,
      category: 'Minuman',
      promoLabel: 'Favorit',
      stockQty: 40,
    },
    {
      id: '8',
      slug: 'gelang-handmade',
      name: 'Gelang Handmade',
      imageUrl:
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      price: 32000,
      originalPrice: 39000,
      sold: 29,
      rating: 4.7,
      category: 'Aksesoris',
      promoLabel: 'Promo',
      stockQty: 0,
    },
  ];

  return {
    businessName: subdomain
      ? `${subdomain.toUpperCase()} Store`
      : 'Talase Store',
    businessType: 'Official Ecommerce Store',
    categories,
    products,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStoreData(subdomain);

  const category =
    store.categories.find((item) => item.slug === slug) ||
    store.categories[0];

  const categoryProducts = store.products.filter(
    (product) => product.category.toLowerCase() === category.slug,
  );

  const otherCategories = store.categories.filter(
    (item) => item.slug !== category.slug,
  );

  return (
    <main className="min-h-screen bg-[#F6FAF7] text-[#1E293B]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#64748B]">
            <Link href="/" className="hover:text-[#009A3E]">
              Beranda
            </Link>
            <ChevronRight size={15} />
            <Link href="/products" className="hover:text-[#009A3E]">
              Produk
            </Link>
            <ChevronRight size={15} />
            <span className="text-[#1E293B]">{category.name}</span>
          </div>
        </div>
      </section>

      {/* HERO CATEGORY */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#009A3E] via-[#007A32] to-[#0B4F8A]" />

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
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SummaryCard title="Produk" value={`${categoryProducts.length}`} />
              <SummaryCard title="Status" value="Publish" />
            </div>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
              <Search size={18} className="text-[#64748B]" />
              <span className="text-sm font-bold text-[#94A3B8]">
                Cari produk kategori {category.name}...
              </span>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-black text-[#1E293B] transition hover:bg-[#F8FAFC]">
              <Filter size={17} />
              Filter
            </button>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.01]">
              <SlidersHorizontal size={17} />
              Urutkan
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
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

          <div className="hidden items-center gap-2 text-sm font-black text-[#009A3E] md:inline-flex">
            <Grid3X3 size={16} />
            {categoryProducts.length} Produk
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F1F5F9] text-[#94A3B8]">
              <ShoppingBag size={28} />
            </div>

            <h3 className="mt-5 text-xl font-black text-[#1E293B]">
              Produk belum tersedia
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-[#64748B]">
              Produk pada kategori ini belum dipublish oleh toko.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-lg"
            >
              Lihat Semua Produk
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>

      {/* OTHER CATEGORIES */}
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
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <StoreFooter businessName={store.businessName} />
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

function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stockQty <= 0;

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
            <span className="inline-flex items-center gap-1 rounded-full bg-[#009A3E] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
              <Tag size={11} />
              {product.promoLabel}
            </span>

            {isOutOfStock && (
              <span className="rounded-full bg-[#E60046] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                Habis
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs font-black uppercase tracking-wide text-[#009A3E]">
          {product.category}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[42px] text-sm font-black leading-5 text-[#1E293B] transition group-hover:text-[#009A3E] md:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3">
          <p className="text-lg font-black text-[#1E293B]">
            {formatCurrency(product.price)}
          </p>

          <p className="mt-1 text-xs font-bold text-[#94A3B8] line-through">
            {formatCurrency(product.originalPrice)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-[#64748B]">
          <span className="flex items-center gap-1">
            <Star size={13} fill="currentColor" className="text-[#FACC15]" />
            {product.rating}
          </span>

          <span>Terjual {product.sold}</span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-[#E2E8F0] px-3 py-3 text-xs font-black text-[#1E293B] transition hover:bg-[#F8FAFC]"
          >
            Detail
            <ChevronRight size={14} />
          </Link>

          <Link
            href={isOutOfStock ? `/products/${product.slug}` : '/cart'}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition ${
              isOutOfStock
                ? 'bg-[#94A3B8]'
                : 'bg-[#009A3E] hover:scale-[1.04]'
            }`}
            aria-label="Tambah ke keranjang"
          >
            <ShoppingBag size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}