'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import {
  ProductCard,
  type ProductCardItem,
} from '@/components/product/product-card';

type ProductsClientProps = {
  products: ProductCardItem[];
  primaryColor: string;
  accentColor: string;
  cardStyle: string;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
};

type FilterKey = 'all' | 'featured' | 'best_seller' | 'promo' | 'available';
type SortKey = 'latest' | 'price_low' | 'price_high' | 'name';

const filterOptions: Array<{ value: FilterKey; label: string }> = [
  { value: 'all', label: 'Semua Produk' },
  { value: 'featured', label: 'Produk Unggulan' },
  { value: 'best_seller', label: 'Terlaris' },
  { value: 'promo', label: 'Promo' },
  { value: 'available', label: 'Tersedia' },
];

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: 'latest', label: 'Urutkan' },
  { value: 'price_low', label: 'Termurah' },
  { value: 'price_high', label: 'Termahal' },
  { value: 'name', label: 'Nama A-Z' },
];

export function ProductsClient({
  products,
  primaryColor,
  accentColor,
  cardStyle,
  title = 'Semua Produk',
  subtitle,
  searchPlaceholder = 'Cari produk favorit di toko ini...',
}: ProductsClientProps) {
  const [query, setQuery] = useState('');
  const [filterBy, setFilterBy] = useState<FilterKey>('all');
  const [sortBy, setSortBy] = useState<SortKey>('latest');
  const [openDropdown, setOpenDropdown] = useState<'filter' | 'sort' | null>(
    null,
  );

  const filteredProducts = useMemo(() => {
    let rows = [...products];

    if (query.trim()) {
      const keyword = query.toLowerCase().trim();

      rows = rows.filter((product) =>
        [
          product.name,
          product.category,
          product.promoLabel,
          ...(product.promotions?.map((promo) => `${promo.code || ''} ${promo.title || ''}`) || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(keyword),
      );
    }

    if (filterBy === 'featured') {
      rows = rows.filter((product) => product.isFeatured === true);
    }

    if (filterBy === 'best_seller') {
      rows = rows.filter((product) => (product.sold ?? 0) > 0);
    }

    if (filterBy === 'promo') {
      rows = rows.filter((product: any) => {
        const originalPrice = Number(product.sellingPrice || product.originalPrice || product.price || 0);
        const discountPrice = Number(product.discountPrice || 0);
        const hasDiscount =
          product.hasDiscount === true &&
          discountPrice > 0 &&
          discountPrice < originalPrice;

        return (
          hasDiscount ||
          Boolean(product.promoLabel) ||
          Boolean(product.promotionIds?.length) ||
          Boolean(product.promotions?.length)
        );
      });
    }

    if (filterBy === 'available') {
      rows = rows.filter(
        (product) =>
          product.stockEnabled !== true || (product.stockQty ?? 0) > 0,
      );
    }

    rows.sort((a, b) => {
      if (filterBy === 'best_seller') {
        return (b.sold ?? 0) - (a.sold ?? 0);
      }

      const getFinalPrice = (product: ProductCardItem) => {
        const originalPrice = Number(product.sellingPrice || product.originalPrice || product.price || 0);
        const discountPrice = Number(product.discountPrice || 0);

        return product.hasDiscount === true &&
          discountPrice > 0 &&
          discountPrice < originalPrice
          ? discountPrice
          : Number(product.finalPrice || product.price || originalPrice);
      };

      if (sortBy === 'price_low') return getFinalPrice(a) - getFinalPrice(b);
      if (sortBy === 'price_high') return getFinalPrice(b) - getFinalPrice(a);
      if (sortBy === 'name') return a.name.localeCompare(b.name);

      return 0;
    });

    return rows;
  }, [products, query, filterBy, sortBy]);

  const resetFilter = () => {
    setQuery('');
    setFilterBy('all');
    setSortBy('latest');
    setOpenDropdown(null);
  };

  const activeFilterLabel =
    filterOptions.find((item) => item.value === filterBy)?.label ||
    'Semua Produk';

  const activeSortLabel =
    sortOptions.find((item) => item.value === sortBy)?.label || 'Urutkan';

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <div className="rounded-[30px] border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_420px] lg:items-center">
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4">
              <Search size={18} className="shrink-0 text-[#64748B]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm font-bold text-[#102033] outline-none placeholder:text-[#94A3B8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CustomDropdown<FilterKey>
                label={activeFilterLabel}
                value={filterBy}
                options={filterOptions}
                open={openDropdown === 'filter'}
                onToggle={() =>
                  setOpenDropdown(openDropdown === 'filter' ? null : 'filter')
                }
                onChange={(value) => {
                  setFilterBy(value);
                  setOpenDropdown(null);
                }}
                primaryColor={primaryColor}
              />

              <CustomDropdown<SortKey>
                label={activeSortLabel}
                value={sortBy}
                options={sortOptions}
                open={openDropdown === 'sort'}
                onToggle={() =>
                  setOpenDropdown(openDropdown === 'sort' ? null : 'sort')
                }
                onChange={(value) => {
                  setSortBy(value);
                  setOpenDropdown(null);
                }}
                primaryColor={primaryColor}
                filled
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#64748B]">
              {subtitle || `Menampilkan ${filteredProducts.length} dari ${products.length} produk.`}
            </p>
          </div>

          {(query || filterBy !== 'all' || sortBy !== 'latest') && (
            <button
              type="button"
              onClick={resetFilter}
              className="hidden items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-black text-[#64748B] transition hover:bg-[#F8FAFC] md:inline-flex"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                primaryColor={primaryColor}
                accentColor={accentColor}
                cardStyle={cardStyle}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center shadow-sm">
            <SlidersHorizontal
              size={34}
              className="mx-auto text-[#94A3B8]"
            />

            <p className="mt-4 text-sm font-bold text-[#64748B]">
              Produk tidak ditemukan.
            </p>

            <button
              type="button"
              onClick={resetFilter}
              className="mt-5 rounded-2xl px-5 py-3 text-sm font-black text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function CustomDropdown<T extends string>({
  label,
  value,
  options,
  open,
  onToggle,
  onChange,
  primaryColor,
  filled = false,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  open: boolean;
  onToggle: () => void;
  onChange: (value: T) => void;
  primaryColor: string;
  filled?: boolean;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl border px-4 pl-4 pr-3 text-left text-sm font-black outline-none transition"
        style={
          filled
            ? {
                borderColor: primaryColor,
                backgroundColor: primaryColor,
                color: '#FFFFFF',
              }
            : {
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#102033',
              }
        }
      >
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-2xl">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-black transition hover:bg-[#F8FAFC]"
                style={{
                  color: active ? primaryColor : '#64748B',
                  backgroundColor: active ? `${primaryColor}12` : '#FFFFFF',
                }}
              >
                <span>{option.label}</span>
                {active && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}