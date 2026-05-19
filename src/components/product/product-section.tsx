import Link from 'next/link';
import { ChevronRight, PackageSearch } from 'lucide-react';

import {
  ProductCard,
  type ProductCardItem,
} from '@/components/product/product-card';

type ProductSectionProps = {
  title?: string;
  subtitle?: string;
  products: ProductCardItem[];
  href?: string;
  emptyText?: string;
  primaryColor?: string;
  accentColor?: string;
  cardStyle?: string;
  gridClassName?: string;
};

export function ProductSection({
  title,
  subtitle,
  products,
  href = '/products',
  emptyText = 'Produk belum tersedia.',
  primaryColor = '#009A3E',
  accentColor = '#FF7A1A',
  cardStyle = 'rounded_card',
  gridClassName = 'md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-5',
}: ProductSectionProps) {
  const layoutClassName = [
    'flex gap-3 overflow-x-auto pb-3 pr-4 snap-x snap-mandatory',
    '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    'md:overflow-visible md:pb-0 md:pr-0 md:snap-none',
    gridClassName,
  ].join(' ');

  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-5 flex items-end justify-between gap-4 md:mb-6">
          <div className="min-w-0">
            {title && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  <PackageSearch size={17} />
                </span>

                <h2 className="text-2xl font-black text-[#102033] md:text-3xl">
                  {title}
                </h2>
              </div>
            )}

            {subtitle && (
              <p className="mt-2 text-sm font-semibold leading-6 text-[#64748B]">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={href}
            className="shrink-0 items-center gap-1 text-xs font-black md:inline-flex md:text-sm"
            style={{ color: primaryColor }}
          >
            Lihat Semua
            <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {products.length > 0 ? (
        <div className={layoutClassName}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              highlight={index === 0}
              primaryColor={primaryColor}
              accentColor={accentColor}
              cardStyle={cardStyle}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center shadow-sm">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <PackageSearch size={25} />
          </div>

          <p className="mt-4 text-sm font-bold text-[#64748B]">
            {emptyText}
          </p>
        </div>
      )}
    </section>
  );
}