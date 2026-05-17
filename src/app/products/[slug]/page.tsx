import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import { resolveSubdomain } from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  sold: number;
  rating: number;
  category: string;
  promoLabel: string;
  stockQty: number;
  unit: string;
  isFeatured: boolean;
};

async function getStoreData(subdomain: string | null) {
  const products: Product[] = [
    {
      id: '1',
      slug: 'kopi-arabica-premium',
      name: 'Kopi Arabica Premium',
      description:
        'Kopi arabica pilihan dengan aroma khas, rasa seimbang, dan cocok untuk penikmat kopi harian maupun hadiah premium.',
      imageUrl:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      price: 45000,
      originalPrice: 55000,
      sold: 128,
      rating: 4.9,
      category: 'Minuman',
      promoLabel: 'Promo',
      stockQty: 24,
      unit: 'pcs',
      isFeatured: true,
    },
    {
      id: '2',
      slug: 'paket-snack-umkm',
      name: 'Paket Snack UMKM',
      description:
        'Paket snack lokal berkualitas, cocok untuk camilan keluarga, hampers, acara kantor, dan kebutuhan harian.',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      price: 25000,
      originalPrice: 30000,
      sold: 87,
      rating: 4.8,
      category: 'Makanan',
      promoLabel: 'Best Seller',
      stockQty: 18,
      unit: 'pack',
      isFeatured: true,
    },
    {
      id: '3',
      slug: 'kaos-premium-talase',
      name: 'Kaos Premium Talase',
      description:
        'Kaos premium dengan bahan nyaman, desain clean, dan cocok digunakan untuk aktivitas harian.',
      imageUrl:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
      price: 99000,
      originalPrice: 125000,
      sold: 42,
      rating: 5.0,
      category: 'Fashion',
      promoLabel: 'Unggulan',
      stockQty: 9,
      unit: 'pcs',
      isFeatured: true,
    },
    {
      id: '4',
      slug: 'tumbler-eksklusif',
      name: 'Tumbler Eksklusif',
      description:
        'Tumbler elegan untuk menemani aktivitas harian, menjaga minuman tetap nyaman dibawa ke mana saja.',
      imageUrl:
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
      price: 65000,
      originalPrice: 79000,
      sold: 63,
      rating: 4.7,
      category: 'Aksesoris',
      promoLabel: 'Diskon',
      stockQty: 12,
      unit: 'pcs',
      isFeatured: false,
    },
  ];

  return {
    businessName: subdomain
      ? `${subdomain.toUpperCase()} Store`
      : 'Talase Store',
    businessType: 'Official Ecommerce Store',
    products,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStoreData(subdomain);

  const product =
    store.products.find((item) => item.slug === params.slug) ||
    store.products[0];

  const relatedProducts = store.products.filter(
    (item) => item.id !== product.id,
  );

  const isOutOfStock = product.stockQty <= 0;

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
            <span className="line-clamp-1 text-[#1E293B]">
              {product.name}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-black text-[#009A3E]"
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
                <span className="inline-flex items-center gap-1 rounded-full bg-[#009A3E] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                  <Tag size={13} />
                  {product.promoLabel}
                </span>

                {isOutOfStock && (
                  <span className="rounded-full bg-[#E60046] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                    Habis
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[product.imageUrl, product.imageUrl, product.imageUrl].map(
                (image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-[34px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F7EE] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#009A3E]">
              <Sparkles size={14} />
              {product.category}
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-[#1E293B] md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <Star size={16} fill="currentColor" className="text-[#FACC15]" />
                {product.rating}
              </span>

              <span>Terjual {product.sold}</span>

              <span>
                Stok:{' '}
                <strong className={isOutOfStock ? 'text-[#E60046]' : 'text-[#009A3E]'}>
                  {isOutOfStock ? 'Habis' : `${product.stockQty} ${product.unit}`}
                </strong>
              </span>
            </div>

            <div className="mt-6 rounded-[26px] bg-[#F8FAFC] p-5">
              <p className="text-4xl font-black text-[#009A3E]">
                {formatCurrency(product.price)}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-sm font-bold text-[#94A3B8] line-through">
                  {formatCurrency(product.originalPrice)}
                </p>

                <span className="rounded-full bg-[#FFF1E6] px-3 py-1 text-xs font-black text-[#FF7A1A]">
                  Hemat {formatCurrency(product.originalPrice - product.price)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-black text-[#1E293B]">
                Deskripsi Produk
              </h2>

              <p className="mt-3 text-sm font-semibold leading-8 text-[#64748B] md:text-base">
                {product.description}
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-[auto_1fr]">
              <div className="inline-flex h-14 items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white px-4">
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B]">
                  <Minus size={16} />
                </button>

                <span className="mx-5 text-sm font-black">1</span>

                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F7EE] text-[#009A3E]">
                  <Plus size={16} />
                </button>
              </div>

              <Link
                href={isOutOfStock ? '/products' : '/cart'}
                className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-xl transition ${
                  isOutOfStock
                    ? 'bg-[#94A3B8]'
                    : 'bg-[#009A3E] hover:scale-[1.01]'
                }`}
              >
                <ShoppingBag size={18} />
                {isOutOfStock ? 'Produk Habis' : 'Tambah ke Keranjang'}
              </Link>
            </div>

            <button className="mt-4 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#1E293B] transition hover:bg-[#F8FAFC]">
              <Heart size={18} />
              Simpan Produk
            </button>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<ShieldCheck size={20} />}
                title="Aman"
                subtitle="Pesanan tercatat"
              />

              <InfoCard
                icon={<Truck size={20} />}
                title="Cepat"
                subtitle="Diproses toko"
              />

              <InfoCard
                icon={<ShoppingBag size={20} />}
                title="Mudah"
                subtitle="Checkout online"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              Produk Terkait
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#64748B]">
              Produk lain yang mungkin cocok untuk Anda.
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

        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <RelatedProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <StoreFooter businessName={store.businessName} />
    </main>
  );
}

function InfoCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E]">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-[#1E293B]">
        {title}
      </h3>

      <p className="mt-1 text-xs font-bold text-[#64748B]">
        {subtitle}
      </p>
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
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

          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-[#009A3E] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
              {product.promoLabel}
            </span>
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

        <p className="mt-3 text-lg font-black text-[#1E293B]">
          {formatCurrency(product.price)}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-[#64748B]">
          <span className="flex items-center gap-1">
            <Star size={13} fill="currentColor" className="text-[#FACC15]" />
            {product.rating}
          </span>

          <span>Terjual {product.sold}</span>
        </div>
      </div>
    </div>
  );
}