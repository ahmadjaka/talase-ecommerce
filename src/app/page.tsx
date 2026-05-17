# ecommerce/src/app/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowRight,
  ChevronRight,
  Flame,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';
import { ProductSection } from '@/components/product/product-section';

import { resolveSubdomain } from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

async function getStoreData(subdomain: string | null) {
  return {
    businessName: subdomain
      ? `${subdomain.toUpperCase()} Store`
      : 'Talase Store',
    businessType: 'Official Ecommerce Store',
    heroTitle: 'Belanja Modern Untuk UMKM & Toko Lokal Indonesia',
    heroSubtitle:
      'Talase menghadirkan pengalaman ecommerce modern dengan tampilan profesional, checkout cepat, dan sistem toko online terintegrasi.',
    heroBannerUrl:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop',
    categories: [
      {
        slug: 'makanan',
        name: 'Makanan',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      },
      {
        slug: 'fashion',
        name: 'Fashion',
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      },
      {
        slug: 'minuman',
        name: 'Minuman',
        image:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      },
      {
        slug: 'aksesoris',
        name: 'Aksesoris',
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
      },
    ],
    featuredProducts: [
      {
        id: '1',
        slug: 'kopi-arabica-premium',
        name: 'Kopi Arabica Premium',
        imageUrl:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
        price: 45000,
        sold: 128,
        rating: 4.9,
        category: 'Minuman',
      },
      {
        id: '2',
        slug: 'paket-snack-umkm',
        name: 'Paket Snack UMKM',
        imageUrl:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
        price: 25000,
        sold: 87,
        rating: 4.8,
        category: 'Makanan',
      },
      {
        id: '3',
        slug: 'kaos-premium-talase',
        name: 'Kaos Premium Talase',
        imageUrl:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
        price: 99000,
        sold: 42,
        rating: 5.0,
        category: 'Fashion',
      },
      {
        id: '4',
        slug: 'tumbler-eksklusif',
        name: 'Tumbler Eksklusif',
        imageUrl:
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
        price: 65000,
        sold: 63,
        rating: 4.7,
        category: 'Aksesoris',
      },
    ],
  };
}

export default async function HomePage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStoreData(subdomain);

  return (
    <main className="min-h-screen bg-[#F6FAF7] text-[#1E293B]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#009A3E] via-[#007A32] to-[#0B4F8A]" />

        <div className="absolute inset-0 opacity-15">
          <Image
            src={store.heroBannerUrl}
            alt={store.businessName}
            fill
            className="object-cover"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 md:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-white backdrop-blur-md md:text-sm">
              <Sparkles size={16} />
              Talase Ecommerce
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
              {store.heroTitle}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
              {store.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#009A3E] shadow-2xl transition hover:scale-[1.02]"
              >
                Belanja Sekarang
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Keranjang
                <ShoppingBag size={18} />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              <FeatureStat
                icon={<Store size={18} />}
                title="Multi Store"
                subtitle="Subdomain otomatis"
              />

              <FeatureStat
                icon={<ShieldCheck size={18} />}
                title="Secure"
                subtitle="SSL & Firebase"
              />

              <FeatureStat
                icon={<Truck size={18} />}
                title="Fast Checkout"
                subtitle="Optimized flow"
              />

              <FeatureStat
                icon={<Flame size={18} />}
                title="Flash Promo"
                subtitle="Voucher ecommerce"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {store.featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`overflow-hidden rounded-[30px] border border-white/15 bg-white/10 backdrop-blur-xl ${
                  index === 0 ? 'translate-y-4' : ''
                } ${index === 1 ? '-translate-y-3' : ''}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 hover:scale-110"
                  />
                </div>

                <div className="space-y-2 p-4">
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-black text-white">
                    <Tag size={11} />
                    {product.category}
                  </div>

                  <h3 className="line-clamp-2 text-sm font-black text-white md:text-base">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-black text-[#FFF15A]">
                      {formatCurrency(product.price)}
                    </p>

                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                      <Star size={13} fill="currentColor" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              Jelajahi Kategori
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#64748B]">
              Temukan produk terbaik dari berbagai kategori toko.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden items-center gap-2 text-sm font-black text-[#009A3E] md:inline-flex"
          >
            Semua Produk
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {store.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative aspect-[1.2/1] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-black text-white">
                    {category.name}
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/85">
                    Lihat Produk
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="mx-auto max-w-7xl px-5 py-2 md:px-8">
        <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-[#009A3E] to-[#0B4F8A] px-6 py-7 md:px-10 md:py-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white backdrop-blur-md md:text-sm">
                <Flame size={15} />
                Flash Sale
              </div>

              <h2 className="mt-5 text-3xl font-black text-white md:text-4xl">
                Promo Ecommerce Modern
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                Tingkatkan penjualan toko online dengan voucher, diskon, dan tampilan ecommerce profesional khas marketplace modern.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#009A3E] shadow-xl transition hover:scale-[1.02]"
            >
              Gunakan Promo
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              Produk Pilihan
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#64748B]">
              Produk unggulan dari toko ecommerce Talase.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden items-center gap-2 text-sm font-black text-[#009A3E] md:inline-flex"
          >
            Lihat Semua
            <ChevronRight size={16} />
          </Link>
        </div>

        <ProductSection products={store.featuredProducts} />
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <BenefitCard
            icon={<ShieldCheck size={24} />}
            title="Transaksi Aman"
            subtitle="Didukung Firebase dan sistem modern realtime."
          />

          <BenefitCard
            icon={<Truck size={24} />}
            title="Checkout Cepat"
            subtitle="Alur checkout modern dan responsif di semua device."
          />

          <BenefitCard
            icon={<Sparkles size={24} />}
            title="UI Profesional"
            subtitle="Desain modern seperti ecommerce besar dan marketplace premium."
          />
        </div>
      </section>

      <StoreFooter businessName={store.businessName} />
    </main>
  );
}

function FeatureStat({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-white md:text-base">
        {title}
      </h3>

      <p className="mt-1 text-xs font-semibold leading-5 text-white/75 md:text-sm">
        {subtitle}
      </p>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black text-[#1E293B]">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B]">
        {subtitle}
      </p>
    </div>
  );
}

