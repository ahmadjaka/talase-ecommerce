'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Beef,
  ChevronRight,
  Home,
  LayoutGrid,
  Menu,
  MonitorSmartphone,
  Scissors,
  Search,
  Shirt,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  WashingMachine,
  X,
} from 'lucide-react';

import { getCartItems } from '@/lib/cart';

type StoreHeaderProps = {
  businessName: string;
  businessType?: string;
  contentType?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
};

type HeaderCopy = {
  itemLabel: string;
  catalogLabel: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  searchLabel: string;
};

export function StoreHeader({
  businessName,
  businessType,
  contentType = 'product',
  logoUrl,
  primaryColor = '#073B70',
  secondaryColor = '#0F4C81',
  accentColor = '#FF7A1A',
}: StoreHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const copy = useMemo(() => getHeaderCopy(contentType), [contentType]);
  const LogoIcon = getStoreIcon(contentType);

  const menus = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: copy.itemLabel, href: '/products', icon: LayoutGrid },
    { label: 'Keranjang', href: '/cart', icon: ShoppingBag },
  ];

  const desktopMenus = menus.filter((menu) => menu.href !== '/cart');

  useEffect(() => {
    const syncCart = () => {
      try {
        const items = getCartItems();
        const total = items.reduce((sum, item) => {
          const quantity =
            typeof item.quantity === 'number' && item.quantity > 0
              ? item.quantity
              : 1;

          return sum + quantity;
        }, 0);

        setCartCount(total);
      } catch (_) {
        setCartCount(0);
      }
    };

    syncCart();

    window.addEventListener('storage', syncCart);
    window.addEventListener('talase-cart-updated', syncCart);
    window.addEventListener('focus', syncCart);

    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('talase-cart-updated', syncCart);
      window.removeEventListener('focus', syncCart);
    };
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-white/10 text-white backdrop-blur-xl"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}F2, ${secondaryColor}F2)`,
        }}
      >
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-4 px-4 py-2 md:min-h-[72px] md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 lg:hidden"
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>

            <Link href="/" className="flex min-w-0 items-center gap-3">
              <StoreLogo
                businessName={businessName}
                logoUrl={logoUrl}
                LogoIcon={LogoIcon}
                size="sm"
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                light
              />

              <div className="min-w-0">
                <h1 className="truncate text-base font-black text-white md:text-lg">
                  {businessName}
                </h1>

                <p className="truncate text-[11px] font-bold uppercase tracking-wide text-white/75 md:text-xs">
                  {businessType || copy.sidebarTitle}
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {desktopMenus.map((menu) => {
              const isActive =
                pathname === menu.href ||
                (menu.href !== '/' && pathname.startsWith(menu.href));

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                    isActive
                      ? 'bg-white text-[#102033] shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {menu.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 lg:inline-flex"
              aria-label={copy.searchLabel}
            >
              <Search size={18} />
            </button>

            <Link
              href="/products"
              className="hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20 lg:inline-flex"
            >
              <LayoutGrid size={17} />
              {copy.catalogLabel}
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#102033] shadow-lg transition hover:scale-[1.03]"
              aria-label="Keranjang"
            >
              <ShoppingBag size={18} />

              {cartCount > 0 && (
                <div
                  className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-black text-white shadow-md"
                  style={{ backgroundColor: accentColor }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[70] bg-black/45 backdrop-blur-[3px] transition duration-300 lg:hidden ${
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[80] flex h-full w-[86%] max-w-[360px] flex-col overflow-hidden bg-white shadow-2xl transition duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className="relative overflow-hidden px-5 pb-6 pt-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <StoreLogo
                businessName={businessName}
                logoUrl={logoUrl}
                LogoIcon={LogoIcon}
                size="lg"
                light
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />

              <div className="min-w-0">
                <h2 className="truncate text-lg font-black">
                  {businessName}
                </h2>

                <p className="mt-1 truncate text-xs font-bold uppercase tracking-wide text-white/75">
                  {businessType || copy.sidebarTitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          <p className="relative mt-5 max-w-[280px] text-sm font-semibold leading-6 text-white/85">
            {copy.sidebarSubtitle}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid gap-3">
            {menus.map((menu) => {
              const isActive =
                pathname === menu.href ||
                (menu.href !== '/' && pathname.startsWith(menu.href));

              const Icon = menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-[22px] px-4 py-4 text-sm font-black transition ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'border border-[#E2E8F0] bg-white text-[#1E293B]'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={
                        isActive
                          ? {
                              backgroundColor: 'rgba(255,255,255,0.16)',
                              color: '#FFFFFF',
                            }
                          : {
                              backgroundColor: `${primaryColor}14`,
                              color: primaryColor,
                            }
                      }
                    >
                      <Icon size={18} />
                    </span>

                    {menu.label}
                  </span>

                  <span className="flex items-center gap-2">
                    {menu.href === '/cart' && cartCount > 0 && (
                      <span
                        className="flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-[10px] font-black text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}

                    <ChevronRight
                      size={17}
                      className={isActive ? 'text-white' : 'text-[#94A3B8]'}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <LayoutGrid size={17} />
            {copy.catalogLabel}
          </Link>
        </div>
      </aside>
    </>
  );
}

function StoreLogo({
  businessName,
  logoUrl,
  LogoIcon,
  size,
  light = false,
  primaryColor,
  secondaryColor,
}: {
  businessName: string;
  logoUrl?: string;
  LogoIcon: React.ElementType;
  size: 'sm' | 'lg';
  light?: boolean;
  primaryColor: string;
  secondaryColor: string;
}) {
  const boxSize =
    size === 'lg' ? 'h-14 w-14 rounded-[20px]' : 'h-12 w-12 rounded-[18px]';
  const iconSize = size === 'lg' ? 24 : 22;

  if (logoUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border bg-white shadow-lg ${boxSize} ${
          light ? 'border-white/25' : 'border-[#E2E8F0]'
        }`}
      >
        <Image
          src={logoUrl}
          alt={businessName}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center text-white shadow-lg ring-1 ring-white/20 ${boxSize}`}
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      }}
    >
      <LogoIcon size={iconSize} />
    </div>
  );
}

function getHeaderCopy(contentType: string): HeaderCopy {
  if (contentType === 'food') {
    return {
      itemLabel: 'Menu',
      catalogLabel: 'Lihat Menu',
      sidebarTitle: 'Warung Online',
      sidebarSubtitle:
        'Pilih menu favorit, cek pesanan, lalu checkout dengan mudah.',
      searchLabel: 'Cari menu',
    };
  }

  if (contentType === 'fashion') {
    return {
      itemLabel: 'Koleksi',
      catalogLabel: 'Lihat Koleksi',
      sidebarTitle: 'Toko Fashion',
      sidebarSubtitle:
        'Temukan koleksi favorit dan pilih produk sesuai gaya Anda.',
      searchLabel: 'Cari koleksi',
    };
  }

  if (contentType === 'service' || contentType === 'laundry') {
    return {
      itemLabel: 'Layanan',
      catalogLabel: 'Lihat Layanan',
      sidebarTitle: 'Layanan Online',
      sidebarSubtitle:
        'Pilih layanan yang dibutuhkan dan ajukan pemesanan dengan praktis.',
      searchLabel: 'Cari layanan',
    };
  }

  if (contentType === 'electronics') {
    return {
      itemLabel: 'Produk',
      catalogLabel: 'Lihat Produk',
      sidebarTitle: 'Toko Elektronik',
      sidebarSubtitle:
        'Temukan perangkat dan aksesoris sesuai kebutuhan Anda.',
      searchLabel: 'Cari produk',
    };
  }

  return {
    itemLabel: 'Produk',
    catalogLabel: 'Lihat Produk',
    sidebarTitle: 'Toko Online',
    sidebarSubtitle:
      'Temukan pilihan terbaik dan pesan kebutuhan Anda dengan mudah.',
    searchLabel: 'Cari produk',
  };
}

function getStoreIcon(contentType: string) {
  switch (contentType) {
    case 'food':
      return UtensilsCrossed;
    case 'fashion':
      return Shirt;
    case 'service':
      return Scissors;
    case 'electronics':
      return MonitorSmartphone;
    case 'laundry':
      return WashingMachine;
    case 'meat':
      return Beef;
    default:
      return Store;
  }
}