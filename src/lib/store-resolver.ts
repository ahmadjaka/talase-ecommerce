import {
  firestoreRunQuery,
  parseFirestoreFields,
} from '@/lib/firebase';

const RESERVED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'talase.id',
  'www.talase.id',
  'admin.talase.id',
  'app.talase.id',
  'api.talase.id',
]);

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  secondaryImageUrls: string[];
  price: number;
  originalPrice: number;
  sold: number;
  rating: number;
  category: string;
  categorySlug: string;
  promoLabel: string;
  stockQty: number;
  isFeatured: boolean;
};

export type StoreCategory = {
  slug: string;
  name: string;
  image: string;
  description: string;
};

export type StoreData = {
  mitraId: string;
  subdomain: string | null;
  businessName: string;
  businessType: string;
  logoUrl: string;
  bannerUrl: string;
  whatsapp: string;
  categories: StoreCategory[];
  products: StoreProduct[];
};

export function resolveSubdomain(hostname: string): string | null {
  const cleanHost = hostname
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split(':')[0]
    .trim();

  if (!cleanHost || RESERVED_HOSTS.has(cleanHost)) {
    return null;
  }

  if (cleanHost.endsWith('.localhost')) {
    return sanitizeSubdomain(cleanHost.replace('.localhost', ''));
  }

  if (cleanHost.endsWith('.talase.id')) {
    return sanitizeSubdomain(cleanHost.replace('.talase.id', ''));
  }

  return null;
}

export function sanitizeSubdomain(value: string): string | null {
  const subdomain = value.toLowerCase().trim();

  if (!subdomain) return null;
  if (!/^[a-z0-9-]+$/.test(subdomain)) return null;

  return subdomain;
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getStorefrontData(
  subdomain: string | null,
): Promise<StoreData> {
  const storeMeta = await resolveStoreMeta(subdomain);
  const products = await fetchProducts(storeMeta.mitraId);
  const categories = buildCategories(products);

  return {
    ...storeMeta,
    subdomain,
    products,
    categories,
  };
}

async function resolveStoreMeta(subdomain: string | null) {
  const fallbackMitraId = process.env.NEXT_PUBLIC_DEFAULT_MITRA_ID || '';

  if (subdomain) {
    const byWebsiteSettings = await findFirstByAnyField('website_settings', [
      ['subdomain', subdomain],
      ['slug', subdomain],
      ['storeSlug', subdomain],
    ]);

    if (byWebsiteSettings?.mitraId) {
      return normalizeStoreMeta(byWebsiteSettings);
    }

    const byMitra = await findFirstByAnyField('mitras', [
      ['subdomain', subdomain],
      ['slug', subdomain],
      ['storeSlug', subdomain],
      ['websiteSlug', subdomain],
    ]);

    if (byMitra?.mitraId || byMitra?.id) {
      return normalizeStoreMeta({
        ...byMitra,
        mitraId: byMitra.mitraId || byMitra.id,
      });
    }
  }

  if (fallbackMitraId) {
    const byDefault = await findFirstByAnyField('mitras', [
      ['mitraId', fallbackMitraId],
    ]);

    return normalizeStoreMeta({
      ...(byDefault ?? {}),
      mitraId: fallbackMitraId,
    });
  }

  return normalizeStoreMeta({});
}

async function findFirstByAnyField(
  collectionName: string,
  filters: Array<[string, string]>,
): Promise<Record<string, any> | null> {
  for (const [field, value] of filters) {
    const rows = await firestoreRunQuery({
      from: [{ collectionId: collectionName }],
      where: {
        fieldFilter: {
          field: { fieldPath: field },
          op: 'EQUAL',
          value: { stringValue: value },
        },
      },
      limit: 1,
    });

    const first = rows.find((row: any) => row.document)?.document;

    if (first) {
      return {
        id: first.name.split('/').pop(),
        ...parseFirestoreFields(first.fields),
      };
    }
  }

  return null;
}

async function fetchProducts(mitraId: string): Promise<StoreProduct[]> {
  if (!mitraId) return [];

  const rows = await firestoreRunQuery({
    from: [{ collectionId: 'products' }],
    where: {
      compositeFilter: {
        op: 'AND',
        filters: [
          {
            fieldFilter: {
              field: { fieldPath: 'mitraId' },
              op: 'EQUAL',
              value: { stringValue: mitraId },
            },
          },
          {
            fieldFilter: {
              field: { fieldPath: 'isActive' },
              op: 'EQUAL',
              value: { booleanValue: true },
            },
          },
          {
            fieldFilter: {
              field: { fieldPath: 'isPublishedToWeb' },
              op: 'EQUAL',
              value: { booleanValue: true },
            },
          },
        ],
      },
    },
  });

  return rows
    .map((row: any) => {
      const doc = row.document;
      if (!doc) return null;

      const data = parseFirestoreFields(doc.fields);

      const name = str(data.name || data.productName);
      const category = str(data.category) || 'Lainnya';
      const price = numberValue(data.sellingPrice ?? data.price);
      const stockQty = numberValue(data.stockQty ?? data.stock);
      const imageUrl = str(data.imageUrl);
      const imageUrls = arrayString(data.imageUrls);
      const secondaryImageUrls = arrayString(data.secondaryImageUrls);

      return {
        id: doc.name.split('/').pop(),
        slug: str(data.slug) || slugify(name),
        name,
        description: str(data.description),
        imageUrl:
          imageUrl ||
          imageUrls[0] ||
          'https://res.cloudinary.com/dp5hckktv/image/upload/v1/sample.jpg',
        imageUrls,
        secondaryImageUrls,
        price,
        originalPrice: numberValue(data.originalPrice) || price,
        sold: numberValue(data.sold),
        rating: numberValue(data.rating) || 5,
        category,
        categorySlug: slugify(category),
        promoLabel: str(data.promoLabel) || 'Produk',
        stockQty,
        isFeatured: data.isFeatured === true,
      } satisfies StoreProduct;
    })
    .filter(Boolean)
    .filter((product: StoreProduct) => product.name)
    .filter((product: StoreProduct) => product.price > 0)
    .sort((a: StoreProduct, b: StoreProduct) => {
      if (b.isFeatured !== a.isFeatured) {
        return Number(b.isFeatured) - Number(a.isFeatured);
      }

      return a.name.localeCompare(b.name);
    });
}

function buildCategories(products: StoreProduct[]): StoreCategory[] {
  const map = new Map<string, StoreCategory>();

  for (const product of products) {
    if (map.has(product.categorySlug)) continue;

    map.set(product.categorySlug, {
      slug: product.categorySlug,
      name: product.category,
      image: product.imageUrl,
      description: `Pilihan produk kategori ${product.category}.`,
    });
  }

  return Array.from(map.values());
}

function normalizeStoreMeta(data: Record<string, any>) {
  const businessName =
    str(data.businessName) ||
    str(data.storeName) ||
    str(data.name) ||
    'Talase Store';

  return {
    mitraId: str(data.mitraId || data.id),
    businessName,
    businessType:
      str(data.businessType) ||
      str(data.category) ||
      'Official Ecommerce Store',
    logoUrl: str(data.logoUrl),
    bannerUrl: str(data.bannerUrl),
    whatsapp: str(data.whatsapp || data.phone || data.phoneNumber),
  };
}

function str(value: unknown): string {
  return value?.toString().trim() ?? '';
}

function numberValue(value: unknown): number {
  if (typeof value === 'number') return value;
  return Number(str(value).replace(/[^0-9]/g, '')) || 0;
}

function arrayString(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => str(item))
    .filter(Boolean);
}