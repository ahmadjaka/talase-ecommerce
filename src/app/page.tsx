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

import { PackageSearch } from 'lucide-react';

import {
  resolveSubdomain,
  getStorefrontData,
} from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

export default async function HomePage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStorefrontData(subdomain);

  if (store.resolveStatus !== 'ready') {
    return <StoreStatusPage store={store} />;
  }

  const content = getStoreContentProfile(store.contentType);
  const sectionKeys = resolveHomepageSectionKeys(store);

  const heroProducts = store.featuredProducts.length > 0
    ? store.featuredProducts
    : store.products.slice(0, 4);

  const productGridClass = resolveProductGridClass(store.productGrid);
  const categoryGridClass = resolveCategoryGridClass(store.categoryLayout);

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

      {sectionKeys.map((sectionKey) => {
        if (sectionKey === 'hero_main' && store.showHero) {
          return (
            <HeroSection
              key={sectionKey}
              store={store}
              content={content}
              heroProducts={heroProducts}
            />
          );
        }

        if (
          sectionKey === 'categories' &&
          store.showCategories &&
          store.categories.length > 0
        ) {
          return (
            <CategorySection
              key={sectionKey}
              store={store}
              content={content}
              categoryGridClass={categoryGridClass}
            />
          );
        }

        if (
          sectionKey === 'promo_banner' &&
          store.showPromoSection &&
          (store.promoBannerUrl || store.promoTitle || store.promoSubtitle)
        ) {
          return (
            <PromoSection
              key={sectionKey}
              store={store}
              content={content}
            />
          );
        }

        if (
          sectionKey === 'featured_products' &&
          store.showFeaturedProducts &&
          store.featuredProducts.length > 0
        ) {
          return (
            <FeaturedProductSection
              key={sectionKey}
              store={store}
              content={content}
              productGridClass={productGridClass}
            />
          );
        }

        if (
          sectionKey === 'latest_products' &&
          store.showLatestProducts &&
          store.latestProducts.length > 0
        ) {
          return (
            <LatestProductSection
              key={sectionKey}
              store={store}
              content={content}
              productGridClass={productGridClass}
            />
          );
        }

        if (
          sectionKey === 'about_business' &&
          store.showAboutSection &&
          store.aboutText
        ) {
          return (
            <AboutSection
              key={sectionKey}
              store={store}
              content={content}
            />
          );
        }

        return null;
      })}

      <ServiceBenefitStrip store={store} content={content} />

      {store.showWhatsappButton && store.whatsapp && (
        <a
          href={`https://wa.me/${normalizeWhatsapp(store.whatsapp)}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-black text-white shadow-2xl transition hover:scale-[1.03]"
          style={{ backgroundColor: store.primaryColor }}
        >
          <ShoppingBag size={18} />
          {content.whatsappButton}
        </a>
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

      <AddToCartScript
        products={store.products.map((product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          stockQty: product.stockQty,
          stockEnabled: product.stockEnabled,
          isOutOfStock: product.isOutOfStock,
          unit: product.unit,
        }))}
      />
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

function HeroSection({
  store,
  content,
}: {
  store: any;
  content: any;
  heroProducts: any[];
}) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-5 md:px-8 md:pt-7">
        <div className="relative min-h-[330px] overflow-hidden rounded-[28px] bg-[#102033] shadow-sm ring-1 ring-[#E2E8F0] md:min-h-[420px] md:rounded-[34px]">
          <Image
            src={store.heroBannerUrl}
            alt={store.businessName}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent md:from-black/65 md:via-black/25" />

          <div className="relative z-10 flex min-h-[330px] max-w-2xl flex-col justify-center px-6 py-9 text-white md:min-h-[420px] md:px-12">
            <div
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg"
              style={{ backgroundColor: store.accentColor }}
            >
              <Sparkles size={15} />
              {content.heroBadge}
            </div>

            <h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">
              {store.heroTitle}
            </h1>

            <p className="mt-5 max-w-lg text-sm font-semibold leading-7 text-white/90 md:text-base">
              {store.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
                style={{ backgroundColor: store.accentColor }}
              >
                {content.primaryButton}
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20"
              >
                {content.cartButton}
                <ShoppingBag size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeatureStrip store={store} content={content} />
    </>
  );
}

function FeatureStrip({
  store,
  content,
}: {
  store: any;
  content: any;
}) {
  const items = [
    {
      icon: <Store size={20} />,
      title: content.featureOneTitle,
      subtitle: content.featureOneSubtitle,
    },
    {
      icon: <ShieldCheck size={20} />,
      title: content.featureTwoTitle,
      subtitle: content.featureTwoSubtitle,
    },
    {
      icon: <Truck size={20} />,
      title: content.featureThreeTitle,
      subtitle: content.featureThreeSubtitle,
    },
    {
      icon: <Flame size={20} />,
      title: content.featureFourTitle,
      subtitle: content.featureFourSubtitle,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-5 md:px-8">
      <div className="grid gap-3 rounded-[26px] border border-[#E2E8F0] bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-4"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: store.primaryColor }}
            >
              {item.icon}
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-1 text-sm font-black text-[#102033]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#64748B]">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategorySection({
  store,
  content,
  categoryGridClass,
}: {
  store: any;
  content: any;
  categoryGridClass: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#102033] md:text-3xl">
            Jelajahi Kategori
          </h2>
          <p className="mt-2 text-sm font-semibold text-[#64748B]">
            {content.categorySubtitle}
          </p>
        </div>

        <Link
          href="/products"
          className="hidden items-center gap-2 text-sm font-black md:inline-flex"
          style={{ color: store.primaryColor }}
        >
          {content.allItemsLabel}
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className={categoryGridClass}>
        {store.categories.map((category: any) => {
          if (store.categoryLayout === 'chips') {
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-black shadow-sm"
                style={{ color: store.primaryColor }}
              >
                {category.name}
                <ArrowRight size={14} />
              </Link>
            );
          }

          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-[24px] border border-[#E2E8F0] bg-white px-4 py-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#FFF7ED] md:h-24 md:w-24">
                <Image
                  src={category.image || '/images/placeholder-category.jpg'}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="line-clamp-2 text-sm font-black text-[#102033]">
                {category.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PromoSection({ store, content }: { store: any; content: any }) {
  const promoImage = store.promoBannerUrl || store.heroBannerUrl;
  const promoTitle = store.promoTitle || content.promoTitle;
  const promoSubtitle = store.promoSubtitle || content.promoSubtitle;

  if (!promoImage && !promoTitle && !promoSubtitle) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 md:px-8">
      <div className="relative min-h-[230px] overflow-hidden rounded-[28px] bg-[#102033] shadow-sm ring-1 ring-[#E2E8F0] md:min-h-[300px]">
        {promoImage && (
          <Image
            src={promoImage}
            alt={promoTitle}
            fill
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

        <div className="relative z-10 flex min-h-[230px] max-w-xl flex-col justify-center px-6 py-8 text-white md:min-h-[300px] md:px-10">
          <div
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg"
            style={{ backgroundColor: store.accentColor }}
          >
            <Flame size={15} />
            {content.promoBadge}
          </div>

          <h2 className="text-3xl font-black leading-tight md:text-5xl">
            {promoTitle}
          </h2>

          <p className="mt-3 max-w-lg text-sm font-semibold leading-7 text-white/90 md:text-base">
            {promoSubtitle}
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.02]"
            style={{ backgroundColor: store.accentColor }}
          >
            {content.promoButton}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedProductSection({
  store,
  content,
  productGridClass,
}: {
  store: any;
  content: any;
  productGridClass: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black md:text-3xl">{content.productSectionTitle}</h2>
          <p className="mt-2 text-sm font-semibold text-[#64748B]">
            {content.productSectionSubtitle}
          </p>
        </div>

        <Link href="/products" className="hidden items-center gap-2 text-sm font-black md:inline-flex" style={{ color: store.primaryColor }}>
          {content.allItemsLabel}
          <ChevronRight size={16} />
        </Link>
      </div>

      <ProductSection
        products={store.featuredProducts}
        primaryColor={store.primaryColor}
        accentColor={store.accentColor}
        cardStyle={store.productCardStyle}
        gridClassName={productGridClass}
      />
    </section>
  );
}

function LatestProductSection({
  store,
  content,
  productGridClass,
}: {
  store: any;
  content: any;
  productGridClass: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black md:text-3xl">Produk Terbaru</h2>
          <p className="mt-2 text-sm font-semibold text-[#64748B]">
            Produk terbaru yang sudah dipublish oleh toko.
          </p>
        </div>

        <Link href="/products" className="hidden items-center gap-2 text-sm font-black md:inline-flex" style={{ color: store.primaryColor }}>
          {content.allItemsLabel}
          <ChevronRight size={16} />
        </Link>
      </div>

      <ProductSection
        products={store.latestProducts.slice(0, 8)}
        viewAllLabel={content.allItemsLabel}
        primaryColor={store.primaryColor}
        accentColor={store.accentColor}
        cardStyle={store.productCardStyle}
        gridClassName={productGridClass}
      />

      <div className="mt-7 md:hidden">
        <Link
          href="/products"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-sm font-black transition hover:bg-[#F8FAFC]"
          style={{
            borderColor: store.primaryColor,
            color: store.primaryColor,
            backgroundColor: 'transparent',
          }}
        >
          {content.allItemsLabel}
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

function AboutSection({ store, content }: { store: any; content: any }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <div className="rounded-[34px] border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-10">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide"
            style={{
              backgroundColor: `${store.primaryColor}14`,
              color: store.primaryColor,
            }}
          >
            <Store size={15} />
            {content.aboutBadge}
          </div>

          <h2 className="mt-5 text-2xl font-black text-[#1E293B] md:text-3xl">
            {content.aboutTitle} {store.businessName}
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm font-semibold leading-8 text-[#64748B] md:text-base">
            {store.aboutText}
          </p>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  icon,
  title,
  subtitle,
  primaryColor,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  primaryColor: string;
}) {
  return (
    <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: `${primaryColor}14`,
          color: primaryColor,
        }}
      >
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

function resolveHomepageSectionKeys(store: any) {
  const activeSections = store.sections
    .filter((section: any) => section.isActive)
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
    .map((section: any) => section.key);

  if (activeSections.length === 0) {
    return [
      'hero_main',
      'categories',
      'promo_banner',
      'featured_products',
      'latest_products',
      'about_business',
    ];
  }

  const orderedSections = activeSections.filter(
    (key: string) => key !== 'hero_main',
  );

  return [
    'hero_main',
    ...orderedSections,
  ];
}

function getStoreContentProfile(businessType: string) {
  const type = businessType.toLowerCase();

  // =========================
  // KULINER / FOOD
  // =========================
  if (
    type === 'food' ||
    type.includes('makanan') ||
    type.includes('minuman') ||
    type.includes('kuliner') ||
    type.includes('resto') ||
    type.includes('restaurant') ||
    type.includes('cafe') ||
    type.includes('kafe') ||
    type.includes('warung') ||
    type.includes('dapur') ||
    type.includes('kitchen')
  ) {
    return {
      labelProduct: 'Menu',

      heroBadge: 'Warung Online',
      primaryButton: 'Pesan Sekarang',
      cartButton: 'Lihat Keranjang',
      allItemsLabel: 'Semua Menu',
      detailLabel: 'Lihat Menu',
      aboutBadge: 'Tentang Warung',
      aboutTitle: 'Tentang',
      whatsappButton: 'Pesan via WA',

      featureOneTitle: 'Menu Lengkap',
      featureOneSubtitle:
        'Pilihan makanan dan minuman siap dipesan',

      featureTwoTitle: 'Pesanan Aman',
      featureTwoSubtitle:
        'Checkout mudah dan konfirmasi jelas',

      featureThreeTitle: 'Siap Diproses',
      featureThreeSubtitle:
        'Pesanan diterima langsung oleh penjual',

      featureFourTitle: 'Promo Menu',
      featureFourSubtitle:
        'Penawaran spesial untuk menu favorit',

      categorySubtitle:
        'Pilih kategori menu favorit sesuai selera Anda.',

      promoBadge: 'Promo Menu',

      promoTitle: 'Promo & Paket Hemat',

      promoSubtitle:
        'Nikmati menu favorit dengan harga terbaik dan penawaran spesial dari toko kami.',

      promoButton: 'Lihat Promo',

      productSectionTitle: 'Menu Pilihan',

      productSectionSubtitle:
        'Menu favorit yang paling banyak diminati pelanggan.',

      benefitOneTitle: 'Pesanan Aman',

      benefitOneSubtitle:
        'Pilih menu, cek pesanan, dan lakukan checkout dengan mudah.',

      benefitTwoTitle: 'Pesan Lebih Praktis',

      benefitTwoSubtitle:
        'Pesan makanan dan minuman langsung dari perangkat Anda.',

      benefitThreeTitle: 'Banyak Pilihan Favorit',
      benefitThreeSubtitle:
        'Temukan menu yang cocok untuk makan sendiri, keluarga, atau teman.',
    };
  }

  // =========================
  // FASHION
  // =========================
  if (
    type.includes('fashion') ||
    type.includes('pakaian') ||
    type.includes('baju') ||
    type.includes('kaos') ||
    type.includes('busana') ||
    type.includes('outfit')
  ) {
    return {
      labelProduct: 'Koleksi',

      heroBadge: 'Toko Fashion',
      primaryButton: 'Belanja Sekarang',
      cartButton: 'Lihat Keranjang',
      allItemsLabel: 'Semua Koleksi',
      detailLabel: 'Lihat Koleksi',
      aboutBadge: 'Tentang Toko',
      aboutTitle: 'Tentang',
      whatsappButton: 'Chat Toko',

      featureOneTitle: 'Koleksi Lengkap',
      featureOneSubtitle:
        'Pilihan model, warna, dan ukuran tersedia',

      featureTwoTitle: 'Belanja Aman',
      featureTwoSubtitle:
        'Detail produk jelas sebelum checkout',

      featureThreeTitle: 'Mudah Dipesan',
      featureThreeSubtitle:
        'Pilih koleksi favorit tanpa ribet',

      featureFourTitle: 'Promo Koleksi',
      featureFourSubtitle:
        'Diskon spesial untuk item pilihan',

      categorySubtitle:
        'Temukan koleksi favorit berdasarkan kategori.',

      promoBadge: 'Promo Fashion',

      promoTitle: 'Promo Koleksi Spesial',

      promoSubtitle:
        'Dapatkan pilihan fashion terbaik dengan penawaran menarik dari toko kami.',

      promoButton: 'Lihat Koleksi',

      productSectionTitle: 'Koleksi Pilihan',

      productSectionSubtitle:
        'Produk fashion favorit yang siap melengkapi gaya Anda.',

      benefitOneTitle: 'Detail Produk Jelas',

      benefitOneSubtitle:
        'Lihat informasi ukuran, warna, dan deskripsi produk sebelum membeli.',

      benefitTwoTitle: 'Belanja Lebih Praktis',

      benefitTwoSubtitle:
        'Pilih koleksi favorit dan checkout langsung secara online.',

      benefitThreeTitle: 'Pilihan Gaya Terbaru',
      benefitThreeSubtitle:
        'Temukan koleksi yang cocok untuk aktivitas harian maupun acara spesial.',
    };
  }

  // =========================
  // ELEKTRONIK
  // =========================
  if (
    type.includes('elektronik') ||
    type.includes('gadget') ||
    type.includes('hp') ||
    type.includes('komputer') ||
    type.includes('laptop')
  ) {
    return {
      labelProduct: 'Produk',

      heroBadge: 'Toko Elektronik',
      primaryButton: 'Belanja Sekarang',
      cartButton: 'Lihat Keranjang',
      allItemsLabel: 'Semua Produk',
      detailLabel: 'Lihat Produk',
      aboutBadge: 'Tentang Toko',
      aboutTitle: 'Tentang',
      whatsappButton: 'Chat Penjual',

      featureOneTitle: 'Produk Elektronik Lengkap',
      featureOneSubtitle:
        'Pilihan perangkat dan aksesoris tersedia',

      featureTwoTitle: 'Belanja Lebih Aman',
      featureTwoSubtitle:
        'Informasi produk ditampilkan lebih jelas',

      featureThreeTitle: 'Pesanan Cepat Diproses',
      featureThreeSubtitle:
        'Pilih produk dan checkout lebih praktis',

      featureFourTitle: 'Promo Gadget',
      featureFourSubtitle:
        'Penawaran spesial untuk produk pilihan',

      categorySubtitle:
        'Temukan perangkat sesuai kebutuhan Anda.',

      promoBadge: 'Promo Elektronik',

      promoTitle: 'Promo Gadget & Elektronik',

      promoSubtitle:
        'Nikmati berbagai promo menarik untuk perangkat dan aksesoris pilihan.',

      promoButton: 'Lihat Produk',

      productSectionTitle: 'Produk Pilihan',

      productSectionSubtitle:
        'Produk elektronik favorit pelanggan.',

      benefitOneTitle: 'Informasi Produk Lengkap',

      benefitOneSubtitle:
        'Spesifikasi dan detail produk tersedia lebih jelas.',

      benefitTwoTitle: 'Belanja Praktis',

      benefitTwoSubtitle:
        'Pilih perangkat favorit langsung dari perangkat Anda.',

      benefitThreeTitle: 'Pilihan Sesuai Kebutuhan',
      benefitThreeSubtitle:
        'Temukan perangkat dan aksesoris yang cocok untuk aktivitas Anda.',
    };
  }

  // =========================
  // JASA / SERVICE
  // =========================
  if (
    type.includes('jasa') ||
    type.includes('service') ||
    type.includes('layanan') ||
    type.includes('laundry') ||
    type.includes('salon') ||
    type.includes('barbershop')
  ) {
    return {
      labelProduct: 'Layanan',

      heroBadge: 'Layanan Online',
      primaryButton: 'Booking Sekarang',
      cartButton: 'Lihat Pesanan',
      allItemsLabel: 'Semua Layanan',
      detailLabel: 'Lihat Layanan',
      aboutBadge: 'Tentang Layanan',
      aboutTitle: 'Tentang',
      whatsappButton: 'Booking via WA',

      featureOneTitle: 'Layanan Lengkap',
      featureOneSubtitle:
        'Pilih layanan sesuai kebutuhan Anda',

      featureTwoTitle: 'Booking Mudah',
      featureTwoSubtitle:
        'Ajukan pesanan layanan secara praktis',

      featureThreeTitle: 'Diproses Cepat',
      featureThreeSubtitle:
        'Permintaan layanan langsung diterima',

      featureFourTitle: 'Promo Layanan',
      featureFourSubtitle:
        'Penawaran spesial untuk layanan tertentu',

      categorySubtitle:
        'Pilih kategori layanan sesuai kebutuhan Anda.',

      promoBadge: 'Promo Layanan',

      promoTitle: 'Penawaran Layanan Spesial',

      promoSubtitle:
        'Nikmati layanan pilihan dengan harga terbaik dan proses pemesanan mudah.',

      promoButton: 'Lihat Layanan',

      productSectionTitle: 'Layanan Pilihan',

      productSectionSubtitle:
        'Layanan yang paling sering dipilih pelanggan.',

      benefitOneTitle: 'Pemesanan Lebih Mudah',

      benefitOneSubtitle:
        'Pilih layanan dan kirim pesanan dengan praktis.',

      benefitTwoTitle: 'Booking Online Praktis',

      benefitTwoSubtitle:
        'Pesan layanan langsung dari perangkat Anda kapan saja.',

      benefitThreeTitle: 'Layanan Sesuai Kebutuhan',
      benefitThreeSubtitle:
        'Pilih layanan yang cocok untuk kebutuhan pribadi, rumah, atau bisnis Anda.',
    };
  }

  // =========================
  // DEFAULT
  // =========================
  return {
    labelProduct: 'Produk',

    heroBadge: 'Toko Online',
    primaryButton: 'Belanja Sekarang',
    cartButton: 'Lihat Keranjang',
    allItemsLabel: 'Semua Produk',
    detailLabel: 'Lihat Produk',
    aboutBadge: 'Tentang Toko',
    aboutTitle: 'Tentang',
    whatsappButton: 'Chat Toko',

    featureOneTitle: 'Produk Lengkap',
    featureOneSubtitle:
      'Pilihan produk siap dipesan online',

    featureTwoTitle: 'Belanja Aman',
    featureTwoSubtitle:
      'Checkout nyaman dan terpercaya',

    featureThreeTitle: 'Pesanan Praktis',
    featureThreeSubtitle:
      'Produk dapat dipesan dengan mudah',

    featureFourTitle: 'Promo Menarik',
    featureFourSubtitle:
      'Diskon dan penawaran spesial tersedia',

    categorySubtitle:
      'Temukan produk favorit berdasarkan kategori.',

    promoBadge: 'Promo Produk',

    promoTitle: 'Promo & Penawaran Spesial',

    promoSubtitle:
      'Nikmati harga terbaik dan berbagai pilihan produk favorit dari toko kami.',

    promoButton: 'Lihat Promo',

    productSectionTitle: 'Produk Pilihan',

    productSectionSubtitle:
      'Produk favorit yang paling banyak diminati pelanggan.',

    benefitOneTitle: 'Belanja Aman',

    benefitOneSubtitle:
      'Pilih produk, cek detail, dan lakukan checkout dengan mudah.',

    benefitTwoTitle: 'Pesan Lebih Praktis',

    benefitTwoSubtitle:
      'Belanja online lebih cepat langsung dari perangkat Anda.',

    benefitThreeTitle: 'Banyak Pilihan Tersedia',
    benefitThreeSubtitle:
      'Temukan pilihan terbaik yang sesuai dengan kebutuhan Anda.',
  };
}

function resolveProductGridClass(productGrid: string) {
  if (productGrid === 'compact_grid') {
    return 'grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5';
  }

  if (productGrid === 'list_grid') {
    return 'grid grid-cols-1 gap-4 md:grid-cols-2';
  }

  return 'grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4';
}

function resolveCategoryGridClass(categoryLayout: string) {
  if (categoryLayout === 'grid') {
    return 'grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8';
  }

  if (categoryLayout === 'chips') {
    return 'flex flex-wrap gap-3';
  }

  return 'flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:w-[112px] [&>*]:shrink-0 md:[&>*]:w-[132px]';
}

function ServiceBenefitStrip({
  store,
  content,
}: {
  store: any;
  content: any;
}) {
  const items = [
    {
      icon: <ShieldCheck size={20} />,
      title: content.benefitOneTitle,
      subtitle: content.benefitOneSubtitle,
    },
    {
      icon: <ShoppingBag size={20} />,
      title: content.benefitTwoTitle,
      subtitle: content.benefitTwoSubtitle,
    },
    {
      icon: <Truck size={20} />,
      title: 'Pengiriman Cepat',
      subtitle: 'Pesanan diproses lebih praktis',
    },
    {
      icon: <Sparkles size={20} />,
      title: content.benefitThreeTitle,
      subtitle: content.benefitThreeSubtitle,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <div className="grid gap-3 rounded-[26px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${store.primaryColor}14`,
                color: store.primaryColor,
              }}
            >
              {item.icon}
            </div>
            <div>
              <h3 className="text-sm font-black text-[#102033]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#64748B]">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
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

  function addToCart(slug) {
    const product = products.find((p) => p.slug === slug || p.id === slug);
    if (!product || product.isOutOfStock) return;

    const cart = readCart();
    const existing = cart.find((item) => item.slug === product.slug || item.id === product.id);

    if (existing) {
      const maxQty = product.stockEnabled ? Math.max(product.stockQty, 1) : 999;
      existing.qty = Math.min(Number(existing.qty || 1) + 1, maxQty);
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
  }

  document.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      const slug = this.getAttribute('data-add-cart');
      if (slug) addToCart(slug);
    });
  });
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

function normalizeWhatsapp(value: string) {
  const cleaned = value.replace(/[^0-9]/g, '');

  if (!cleaned) return '';
  if (cleaned.startsWith('0')) return `62${cleaned.slice(1)}`;
  if (cleaned.startsWith('62')) return cleaned;

  return cleaned;
}