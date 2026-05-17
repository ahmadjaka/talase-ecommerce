import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
};

export function ProductSection({
  title,
  subtitle,
  products,
  href = '/products',
  emptyText = 'Produk belum tersedia.',
}: ProductSectionProps) {
  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-2xl font-black text-[#1E293B] md:text-3xl">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-2 text-sm font-semibold text-[#64748B]">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={href}
            className="hidden items-center gap-2 text-sm font-black text-[#009A3E] md:inline-flex"
          >
            Lihat Semua
            <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              highlight={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[30px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
          <p className="text-sm font-bold text-[#64748B]">
            {emptyText}
          </p>
        </div>
      )}
    </section>
  );
}