'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Menu,
  Search,
  ShoppingBag,
  Store,
} from 'lucide-react';

type StoreHeaderProps = {
  businessName: string;
  businessType?: string;
};

export function StoreHeader({
  businessName,
  businessType,
}: StoreHeaderProps) {
  const pathname = usePathname();

  const menus = [
    {
      label: 'Beranda',
      href: '/',
    },
    {
      label: 'Produk',
      href: '/products',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0]/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#1E293B] transition hover:bg-[#F8FAFC] lg:hidden">
            <Menu size={20} />
          </button>

          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#009A3E] via-[#007A32] to-[#0B4F8A] text-white shadow-lg">
              <Store size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-black text-[#1E293B] md:text-lg">
                {businessName}
              </h1>

              <p className="truncate text-[11px] font-bold uppercase tracking-wide text-[#64748B] md:text-xs">
                {businessType || 'Official Ecommerce Store'}
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER */}
        <nav className="hidden items-center gap-2 lg:flex">
          {menus.map((menu) => {
            const isActive =
              pathname === menu.href ||
              (menu.href !== '/' && pathname.startsWith(menu.href));

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                  isActive
                    ? 'bg-[#009A3E] text-white shadow-lg'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#009A3E]'
                }`}
              >
                {menu.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#1E293B] transition hover:bg-[#F8FAFC] md:inline-flex">
            <Search size={18} />
          </button>

          <Link
            href="/products"
            className="hidden items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-black text-[#1E293B] transition hover:bg-[#F8FAFC] md:inline-flex"
          >
            <LayoutGrid size={17} />
            Katalog
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#009A3E] text-white shadow-lg transition hover:scale-[1.03]"
          >
            <ShoppingBag size={18} />

            <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF7A1A] px-1 text-[10px] font-black text-white shadow-md">
              2
            </div>
          </Link>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="border-t border-[#E2E8F0] bg-white lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-5 py-3 md:px-8">
          {menus.map((menu) => {
            const isActive =
              pathname === menu.href ||
              (menu.href !== '/' && pathname.startsWith(menu.href));

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition ${
                  isActive
                    ? 'bg-[#009A3E] text-white shadow-lg'
                    : 'border border-[#E2E8F0] bg-white text-[#64748B]'
                }`}
              >
                {menu.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}