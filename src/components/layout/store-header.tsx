'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import {
  Beef,
  ChevronRight,
  Facebook,
  Home,
  Instagram,
  LayoutGrid,
  Menu,
  MonitorSmartphone,
  PackageSearch,
  Scissors,
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

  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappUrl?: string;

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

type SocialItem = {
  href?: string;
  icon: ElementType;
  label: string;
};

export function StoreHeader({
  businessName,
  businessType,
  contentType = 'product',
  logoUrl,

  facebookUrl,
  instagramUrl,
  tiktokUrl,
  whatsappUrl,

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
    {
      label: 'Beranda',
      href: '/',
      icon: Home,
    },
    {
      label: copy.itemLabel,
      href: '/products',
      icon: LayoutGrid,
    },
    {
      label: 'Pesanan',
      href: '/order',
      icon: PackageSearch,
    },
    {
      label: 'Keranjang',
      href: '/cart',
      icon: ShoppingBag,
    },
  ];

  const desktopMenus = menus.filter((menu) => menu.href !== '/cart');

  const headerSocials: SocialItem[] = [
    {
      href: facebookUrl || '#',
      icon: Facebook,
      label: 'Facebook',
    },
    {
      href: instagramUrl || '#',
      icon: Instagram,
      label: 'Instagram',
    },
    {
      href: tiktokUrl || '#',
      icon: TiktokIcon,
      label: 'TikTok',
    },
  ];

  const sidebarSocials: SocialItem[] = [
    ...headerSocials,
    {
      href: whatsappUrl || '#',
      icon: WhatsappIcon,
      label: 'WhatsApp',
    },
  ];

  useEffect(() => {
    const syncCart = () => {
      try {
        const items = getCartItems();

        const total = items.reduce((sum, item) => {
          const quantity =
            typeof item.qty === 'number' && item.qty > 0 ? item.qty : 1;

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
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0]/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#102033] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:bg-[#F8FAFC] lg:hidden"
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
              />

              <div className="min-w-0">
                <h1 className="truncate text-[17px] font-black text-[#102033]">
                  {businessName}
                </h1>

                <p className="truncate text-[11px] font-bold uppercase tracking-wide text-[#64748B]">
                  {businessType || copy.sidebarTitle}
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center rounded-[26px] border border-[#E2E8F0] bg-[#F8FAFC]/95 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_38px_rgba(15,23,42,0.08)] lg:flex">
            {desktopMenus.map((menu) => {
              const isActive =
                pathname === menu.href ||
                (menu.href !== '/' && pathname.startsWith(menu.href));

              const Icon = menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`group inline-flex items-center gap-2 rounded-[20px] px-4 py-3 text-sm font-black transition ${
                    isActive
                      ? 'text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)]'
                      : 'text-[#102033] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }
                      : undefined
                  }
                >
                  <Icon
                    size={16}
                    className={isActive ? 'text-white' : 'text-[#64748B]'}
                  />
                  {menu.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 rounded-[24px] border border-[#E2E8F0] bg-white/95 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_36px_rgba(15,23,42,0.08)] md:gap-2">
            {[
              { href: facebookUrl || '#', icon: Facebook, label: 'Facebook' },
              { href: instagramUrl || '#', icon: Instagram, label: 'Instagram' },
              { href: tiktokUrl || '#', icon: TiktokIcon, label: 'TikTok' },
            ].map((social) => {
              const Icon = social.icon;
              const hasUrl = social.href !== '#';

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={hasUrl ? '_blank' : undefined}
                  rel={hasUrl ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  onClick={(e) => {
                    if (!hasUrl) e.preventDefault();
                  }}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#102033] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[#F8FAFC] md:h-11 md:w-11 ${
                    hasUrl ? '' : 'opacity-60'
                  }`}
                >
                  <Icon size={17} />
                </a>
              );
            })}

            <Link
              href="/cart"
              aria-label="Keranjang"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_28px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:scale-[1.03] md:h-11 md:w-11"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <ShoppingBag size={18} />

              {cartCount > 0 && (
                <div
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white px-1 text-[10px] font-black text-white shadow-[0_8px_16px_rgba(15,23,42,0.20)]"
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

              <div className="hidden min-w-0 sm:block">
                <h1 className="truncate text-[17px] font-black text-[#102033]">
                  {businessName}
                </h1>

                <p className="truncate text-[11px] font-bold uppercase tracking-wide text-[#64748B]">
                  {businessType || copy.sidebarTitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_24px_rgba(0,0,0,0.12)] backdrop-blur-md"
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
                      ? 'text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]'
                      : 'border border-[#E2E8F0] bg-white text-[#1E293B] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_20px_rgba(15,23,42,0.05)]'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }
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

                  <ChevronRight
                    size={17}
                    className={isActive ? 'text-white' : 'text-[#94A3B8]'}
                  />
                </Link>
              );
            })}
          </div>

          {sidebarSocials.length > 0 && (
            <>
              <div className="mb-3 mt-7 text-xs font-black uppercase tracking-wide text-[#64748B]">
                Social Media
              </div>

              <div className="flex flex-wrap gap-3">
                {sidebarSocials.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href || '#'}
                      target={
                        social.href && social.href !== '#'
                          ? '_blank'
                          : undefined
                      }
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#102033] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_22px_rgba(15,23,42,0.08)] ${
                        social.href && social.href !== '#'
                          ? ''
                          : 'cursor-default opacity-50'
                      }`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </>
          )}
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
  LogoIcon: ElementType;
  size: 'sm' | 'lg';
  light?: boolean;
  primaryColor: string;
  secondaryColor: string;
}) {
  const boxSize =
    size === 'lg'
      ? 'h-14 w-14 rounded-[20px]'
      : 'h-12 w-12 rounded-[18px]';

  const iconSize = size === 'lg' ? 24 : 22;

  if (logoUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_28px_rgba(15,23,42,0.12)] ${boxSize} ${
          light ? 'border-white/25' : 'border-[#E2E8F0]'
        }`}
      >
        <Image
          src={logoUrl}
          alt={businessName}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_28px_rgba(15,23,42,0.16)] ring-1 ring-white/20 ${boxSize}`}
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      }}
    >
      <LogoIcon size={iconSize} />
    </div>
  );
}

function TiktokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82A5.55 5.55 0 0 0 20 7V4.2a2.78 2.78 0 0 1-3.4-2.2h-2.8v13.35a2.45 2.45 0 1 1-2.45-2.45c.26 0 .52.04.75.12v-2.86a5.3 5.3 0 1 0 4.5 5.24V5.82z" />
    </svg>
  );
}

function WhatsappIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16.04 3C8.84 3 3 8.74 3 15.82c0 2.48.72 4.88 2.08 6.95L3 29l6.42-2.02a13.2 13.2 0 0 0 6.62 1.8H16c7.2 0 13.04-5.74 13.04-12.82C29.04 8.74 23.2 3 16.04 3zm7.58 18.34c-.32.9-1.86 1.7-2.56 1.8-.66.1-1.5.14-2.42-.16-.56-.18-1.28-.42-2.2-.8-3.86-1.6-6.38-5.34-6.58-5.6-.18-.24-1.56-2.02-1.56-3.84 0-1.8.94-2.68 1.28-3.04.34-.36.74-.46.98-.46.24 0 .5 0 .72.02.22 0 .52-.08.82.64.3.72 1 2.5 1.08 2.68.08.18.14.4.02.64-.12.24-.18.4-.36.62-.18.22-.38.5-.54.66-.18.18-.38.38-.16.74.22.36.98 1.6 2.1 2.6 1.44 1.28 2.66 1.68 3.02 1.86.36.18.56.16.76-.1.2-.24.88-1.02 1.12-1.36.24-.34.48-.28.8-.16.32.12 2 .94 2.34 1.1.34.18.56.26.64.4.08.14.08.82-.24 1.72z" />
    </svg>
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