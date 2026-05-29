import {
  firestoreRunQuery,
  parseFirestoreFields,
} from '@/lib/firebase';

const TALASE_PRIMARY = '#073B70';
const TALASE_SECONDARY = '#0B4F8A';
const TALASE_ACCENT = '#FF7A1A';

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dp5hckktv/image/upload/v1/sample.jpg';

const RESERVED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'talase.id',
  'www.talase.id',
  'admin.talase.id',
  'app.talase.id',
  'api.talase.id',
]);

export type StoreResolveStatus =
  | 'ready'
  | 'not_found'
  | 'inactive'
  | 'unpublished';

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

  sellingPrice: number;
  discountPrice: number;
  hasDiscount: boolean;

  promotionIds: string[];

  promotions: Array<{
    promotionId?: string;
    title?: string;
    code?: string;
    promoType?: string;
  }>;
  sold: number;
  rating: number;
  category: string;
  categorySlug: string;
  promoLabel: string;
  stockQty: number;
  stockEnabled: boolean;
  isFeatured: boolean;
  sortOrder: number;
  unit: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  isOutOfStock: boolean;
};

export type StoreCategory = {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
  sortOrder: number;
};

export type StorePromotion = {
  id: string;
  title: string;
  description: string;
  type: string;
  valueType: string;
  value: number;
  minPurchase: number;
  productIds: string[];
  categoryIds: string[];
  voucherCode: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
};

export type StoreSection = {
  id: string;
  type: string;
  key: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  categoryId: string;
  productIds: string[];
  sortOrder: number;
  isActive: boolean;
  config: Record<string, unknown>;
};

export type StorePaymentSettings = {
  transferEnabled: boolean;
  bankName: string;
  bankAccountNumber: string;
  bankAccountOwner: string;
  qrisEnabled: boolean;
  qrisImageUrl: string;
  qrisName: string;
  qrisMerchantNumber: string;
  paymentProofRequired: boolean;
};

export type StoreThemeSettings = {
  templateId: string;
  layoutConfig: Record<string, unknown>;
  colorConfig: Record<string, unknown>;
  sectionConfig: Record<string, unknown>;
  cardConfig: Record<string, unknown>;
  fontConfig: Record<string, unknown>;
};

export type StoreData = {
  resolveStatus: StoreResolveStatus;
  mitraId: string;
  subdomain: string | null;

  businessName: string;
  businessType: string;
  websiteUrl: string;
  websiteStatus: string;
  mitraStatus: string;

  siteTitle: string;
  siteDescription: string;

  logoUrl: string;
  faviconUrl: string;
  bannerUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;

  promoTitle: string;
  promoSubtitle: string;
  promoBannerUrl: string;

  aboutText: string;
  operationalHours: string;

  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;

  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  templateId: string;
  productCardStyle: string;
  categoryLayout: string;
  heroStyle: string;
  productGrid: string;
  fontFamily: string;

  isPublished: boolean;
  showHero: boolean;
  showCategories: boolean;
  showFeaturedProducts: boolean;
  showLatestProducts: boolean;
  showPromoSection: boolean;
  showAboutSection: boolean;
  showContactSection: boolean;
  showTestimonials: boolean;
  showFlashSale: boolean;
  showPopularProducts: boolean;
  showWhatsappButton: boolean;
  showSearchBar: boolean;
  showCategoryMenu: boolean;

  categories: StoreCategory[];
  products: StoreProduct[];
  featuredProducts: StoreProduct[];
  latestProducts: StoreProduct[];
  promotions: StorePromotion[];
  sections: StoreSection[];
  paymentSettings: StorePaymentSettings;
  themeSettings: StoreThemeSettings;

  contentType: string;
};

type StoreMeta = Omit<
  StoreData,
  | 'subdomain'
  | 'categories'
  | 'products'
  | 'featuredProducts'
  | 'latestProducts'
  | 'promotions'
  | 'sections'
  | 'paymentSettings'
  | 'themeSettings'
  | 'contentType'
>;

type FirestoreRecord = Record<string, any>;

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

  if (storeMeta.resolveStatus !== 'ready' || !storeMeta.mitraId) {
    return {
      ...storeMeta,
      subdomain,
      products: [],
      featuredProducts: [],
      latestProducts: [],
      categories: [],
      promotions: [],
      sections: [],
      paymentSettings: normalizePaymentSettings({}),
      themeSettings: normalizeThemeSettings({}),
      contentType: resolveContentType(storeMeta.businessType, []),
    };
  }

  const [
    themeSettings,
    products,
    rawCategories,
    promotions,
    sections,
    paymentSettings,
  ] = await Promise.all([
    fetchThemeSettings(storeMeta.mitraId),
    fetchProducts(storeMeta.mitraId),
    fetchCategories(storeMeta.mitraId),
    fetchPromotions(storeMeta.mitraId),
    fetchSections(storeMeta.mitraId),
    fetchPaymentSettings(storeMeta.mitraId),
  ]);

  const categories =
    rawCategories.length > 0
      ? mergeCategoryImages(rawCategories, products)
      : buildCategoriesFromProducts(products);

  const featuredProducts = products.filter((product) => product.isFeatured);
  const latestProducts = [...products].sort(sortLatestProducts);

  const contentType = resolveContentType(
    storeMeta.businessType,
    products,
  );

  const resolvedTheme = mergeThemeIntoStoreMeta(storeMeta, themeSettings);

  return {
    ...resolvedTheme,
    subdomain,
    products,
    featuredProducts:
      featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8),
    latestProducts: latestProducts.slice(0, 12),
    categories,
    promotions,
    sections,
    paymentSettings,
    themeSettings,
    contentType,
  };
}

export async function getPublicProductDetail(
  subdomain: string | null,
  slug: string,
): Promise<{
  store: StoreData;
  product: StoreProduct | null;
  relatedProducts: StoreProduct[];
}> {
  const store = await getStorefrontData(subdomain);
  const product = store.products.find((item) => item.slug === slug) ?? null;

  const relatedProducts = product
    ? store.products
        .filter(
          (item) =>
            item.id !== product.id &&
            item.categorySlug === product.categorySlug,
        )
        .slice(0, 8)
    : [];

  return {
    store,
    product,
    relatedProducts,
  };
}

export async function getPublicCategoryData(
  subdomain: string | null,
  categorySlug: string,
): Promise<{
  store: StoreData;
  category: StoreCategory | null;
  products: StoreProduct[];
}> {
  const store = await getStorefrontData(subdomain);
  const category =
    store.categories.find((item) => item.slug === categorySlug) ?? null;

  const products = store.products.filter(
    (item) => item.categorySlug === categorySlug,
  );

  return {
    store,
    category,
    products,
  };
}

async function resolveStoreMeta(
  subdomain: string | null,
): Promise<StoreMeta> {
  const fallbackMitraId =
    process.env.NEXT_PUBLIC_DEFAULT_MITRA_ID || '';

  if (subdomain) {
    const websiteUrl = `https://${subdomain}.talase.id`;

    const mitra = await findFirstByAnyStringField('mitras', [
      ['subdomain', subdomain],
      ['websiteUrl', websiteUrl],
      ['slug', subdomain],
      ['storeSlug', subdomain],
      ['websiteSlug', subdomain],
    ]);

    if (mitra?.mitraId || mitra?.id) {
      const mitraId = str(mitra.mitraId || mitra.id);

      const settings =
        (await getDocumentById('website_settings', mitraId)) ||
        (await findFirstByAnyStringField('website_settings', [
          ['mitraId', mitraId],
          ['subdomain', subdomain],
          ['websiteUrl', websiteUrl],
        ]));

      return normalizeStoreMeta({
        ...mitra,
        ...(settings ?? {}),
        mitraId,
        subdomain,
      });
    }

    const websiteSettings = await findFirstByAnyStringField(
      'website_settings',
      [
        ['subdomain', subdomain],
        ['websiteUrl', websiteUrl],
        ['slug', subdomain],
        ['storeSlug', subdomain],
      ],
    );

    if (websiteSettings?.mitraId) {
      const mitraId = str(websiteSettings.mitraId);

      const resolvedMitra =
        (await getDocumentById('mitras', mitraId)) ||
        (await findFirstByAnyStringField('mitras', [
          ['mitraId', mitraId],
          ['subdomain', subdomain],
          ['websiteUrl', websiteUrl],
        ]));

      return normalizeStoreMeta({
        ...(resolvedMitra ?? {}),
        ...websiteSettings,
        mitraId,
        subdomain,
      });
    }

    return normalizeStoreMeta({
      resolveStatus: 'not_found',
      subdomain,
    });
  }

  if (fallbackMitraId) {
    const mitra = await findFirstByAnyStringField('mitras', [
      ['mitraId', fallbackMitraId],
    ]);

    const settings = await findFirstByAnyStringField(
      'website_settings',
      [['mitraId', fallbackMitraId]],
    );

    return normalizeStoreMeta({
      ...(mitra ?? {}),
      ...(settings ?? {}),
      mitraId: fallbackMitraId,
    });
  }

  return normalizeStoreMeta({});
}

async function findFirstByAnyStringField(
  collectionName: string,
  filters: Array<[string, string]>,
): Promise<FirestoreRecord | null> {
  for (const [field, value] of filters) {
    if (!value) continue;

    const rows = await safeRunQuery({
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

async function getDocumentById(
  collectionName: string,
  documentId: string,
): Promise<FirestoreRecord | null> {
  if (!documentId) return null;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';

  if (!projectId) return null;

  const rows = await safeRunQuery({
    from: [{ collectionId: collectionName }],
    where: {
      fieldFilter: {
        field: { fieldPath: '__name__' },
        op: 'EQUAL',
        value: {
          referenceValue: `projects/${projectId}/databases/(default)/documents/${collectionName}/${documentId}`,
        },
      },
    },
    limit: 1,
  });

  const first = rows.find((row: any) => row.document)?.document;

  if (!first) return null;

  return {
    id: first.name.split('/').pop(),
    ...parseFirestoreFields(first.fields),
  };
}

async function fetchThemeSettings(
  mitraId: string,
): Promise<StoreThemeSettings> {
  const rows = await safeRunQuery({
    from: [{ collectionId: 'ecommerce_theme_settings' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'mitraId' },
        op: 'EQUAL',
        value: { stringValue: mitraId },
      },
    },
    limit: 1,
  });

  const doc = rows.find((row: any) => row.document)?.document;

  if (!doc) return normalizeThemeSettings({});

  return normalizeThemeSettings(parseFirestoreFields(doc.fields));
}

async function fetchProducts(
  mitraId: string,
): Promise<StoreProduct[]> {
  if (!mitraId) return [];

  const rows = await safeRunQuery({
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
        ],
      },
    },
    limit: 1000,
  });

  return rows
    .map((row: any) => {
      const doc = row.document;
      if (!doc) return null;

      const data = parseFirestoreFields(doc.fields);
      if (data.isActive === false) return null;
      if (data.isPublishedToWeb === false) return null;

      const id = str(data.productId) || doc.name.split('/').pop();
      const name = str(data.name || data.productName);
      const category = str(data.category) || 'Lainnya';
      const categorySlug =
        str(data.categorySlug) || slugify(category);
      const sellingPrice = numberValue(data.sellingPrice ?? data.price);
      const discountPrice = numberValue(data.discountPrice);
      const hasDiscount =
        discountPrice > 0 &&
        discountPrice < sellingPrice;

      const stockQty = numberValue(data.stockQty ?? data.stock);
      const stockEnabled = data.stockEnabled === true;
      const imageUrl = str(
        data.imageUrl ||
        data.photoUrl ||
        data.productImageUrl ||
        data.thumbnailUrl ||
        data.image,
      );
      const imageUrls = arrayString(data.imageUrls);
      const secondaryImageUrls = arrayString(data.secondaryImageUrls);
      const sortOrder = numberValue(data.sortOrder);

      return {
        id,
        slug: str(data.slug) || slugify(name),
        name,
        description: str(data.description),
        imageUrl:
          imageUrl ||
          imageUrls[0] ||
          secondaryImageUrls[0] ||
          DEFAULT_IMAGE,
        imageUrls,
        secondaryImageUrls,

        price: hasDiscount ? discountPrice : sellingPrice,
        originalPrice:
          numberValue(data.originalPrice) ||
          numberValue(data.compareAtPrice) ||
          sellingPrice,
        sellingPrice,
        discountPrice,
        hasDiscount,
        promotionIds: arrayString(data.promotionIds),
        promotions: Array.isArray(data.promotions) ? data.promotions : [],

        sold: numberValue(data.sold),
        rating: numberValue(data.rating) || 5,
        category,
        categorySlug,
        promoLabel: str(data.promoLabel),
        stockQty,
        stockEnabled,
        isFeatured: data.isFeatured === true || data.isFavorite === true,
        sortOrder,
        unit: str(data.unit),
        seoTitle: str(data.seoTitle),
        seoDescription: str(data.seoDescription),
        createdAt: dateString(data.createdAt),
        updatedAt: dateString(data.updatedAt),
        isOutOfStock: stockEnabled && stockQty <= 0,
      } satisfies StoreProduct;
    })
    .filter(isNotNull)
    .filter((product) => product.name)
    .filter((product) => product.price > 0)
    .sort(sortProducts);
}

async function fetchCategories(
  mitraId: string,
): Promise<StoreCategory[]> {
  const rows = await safeRunQuery({
    from: [{ collectionId: 'product_categories' }],
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
        ],
      },
    },
  });

  return rows
    .map((row: any) => {
      const doc = row.document;
      if (!doc) return null;

      const data = parseFirestoreFields(doc.fields);
      const name = str(data.name);
      const isPublishedToWeb = data.isPublishedToWeb !== false;

      if (!isPublishedToWeb) return null;

      const id = str(data.categoryId) || doc.name.split('/').pop();

      return {
        id,
        slug: str(data.slug) || slugify(name),
        name,
        image: str(data.imageUrl) || DEFAULT_IMAGE,
        description: str(data.description),
        sortOrder: numberValue(data.sortOrder),
      } satisfies StoreCategory;
    })
    .filter(isNotNull)
    .filter((category) => category.name)
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      return a.name.localeCompare(b.name);
    });
}

async function fetchPromotions(
  mitraId: string,
): Promise<StorePromotion[]> {
  const rows = await safeRunQuery({
    from: [{ collectionId: 'promotions' }],
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
        ],
      },
    },
  });

  return rows
    .map((row: any) => {
      const doc = row.document;
      if (!doc) return null;

      const data = parseFirestoreFields(doc.fields);
      const promotion = {
        id: str(data.promotionId) || doc.name.split('/').pop(),
        title: str(data.title),
        description: str(data.description),
        type: str(data.type),
        valueType: str(data.valueType),
        value: numberValue(data.value),
        minPurchase: numberValue(data.minPurchase),
        productIds: arrayString(data.productIds),
        categoryIds: arrayString(data.categoryIds),
        voucherCode: str(data.voucherCode).toUpperCase(),
        startAt: dateString(data.startAt),
        endAt: dateString(data.endAt),
        isActive: data.isActive === true,
      } satisfies StorePromotion;

      return isPromotionCurrentlyActive(promotion)
        ? promotion
        : null;
    })
    .filter(isNotNull);
}

async function fetchSections(
  mitraId: string,
): Promise<StoreSection[]> {
  const rows = await safeRunQuery({
    from: [{ collectionId: 'website_sections' }],
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
        ],
      },
    },
  });

  return rows
    .map((row: any) => {
      const doc = row.document;
      if (!doc) return null;

      const data = parseFirestoreFields(doc.fields);

      return {
        id: str(data.sectionId) || doc.name.split('/').pop(),
        type: str(data.type),
        key: str(data.key),
        title: str(data.title),
        subtitle: str(data.subtitle),
        imageUrl: str(data.imageUrl),
        categoryId: str(data.categoryId),
        productIds: arrayString(data.productIds),
        sortOrder: numberValue(data.sortOrder),
        isActive: data.isActive !== false,
        config: objectValue(data.config),
      } satisfies StoreSection;
    })
    .filter(isNotNull)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

async function fetchPaymentSettings(
  mitraId: string,
): Promise<StorePaymentSettings> {
  const rows = await safeRunQuery({
    from: [{ collectionId: 'payment_settings' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'mitraId' },
        op: 'EQUAL',
        value: { stringValue: mitraId },
      },
    },
    limit: 1,
  });

  const doc = rows.find((row: any) => row.document)?.document;

  if (!doc) return normalizePaymentSettings({});

  return normalizePaymentSettings(parseFirestoreFields(doc.fields));
}

function normalizeStoreMeta(data: FirestoreRecord): StoreMeta {
  const businessName =
    str(data.businessName) ||
    str(data.storeName) ||
    str(data.name) ||
    'Talase Store';

  const mitraStatus = str(data.status) || 'active';
  const websiteStatus = str(data.websiteStatus) || 'active';
  const isPublished = data.isPublished !== false;

  let resolveStatus: StoreResolveStatus =
    data.resolveStatus || 'ready';

  if (resolveStatus === 'ready') {
    if (mitraStatus !== 'active' || websiteStatus !== 'active') {
      resolveStatus = 'inactive';
    } else if (!isPublished) {
      resolveStatus = 'unpublished';
    }
  }

  return {
    resolveStatus,
    mitraId: str(data.mitraId || data.id),

    businessName,
    businessType:
      str(data.businessType) ||
      str(data.category) ||
      'Toko Online',
    websiteUrl: str(data.websiteUrl),
    websiteStatus,
    mitraStatus,

    siteTitle: str(data.siteTitle) || businessName,
    siteDescription: str(data.siteDescription),

    logoUrl: str(data.logoUrl),
    faviconUrl: str(data.faviconUrl),
    bannerUrl: str(data.bannerUrl || data.heroBannerUrl),
    heroTitle:
      str(data.heroTitle) ||
      `Selamat datang di ${businessName}`,
    heroSubtitle:
      str(data.heroSubtitle) ||
      str(data.siteDescription) ||
      'Temukan pilihan terbaik dan pesan dengan lebih mudah.',
    heroBannerUrl:
      str(data.heroBannerUrl || data.bannerUrl) || DEFAULT_IMAGE,

    promoTitle: str(data.promoTitle),
    promoSubtitle: str(data.promoSubtitle),
    promoBannerUrl: str(data.promoBannerUrl),

    aboutText: str(data.aboutText),
    operationalHours: str(data.operationalHours),

    whatsapp: str(
      data.whatsapp ||
        data.contactWhatsapp ||
        data.phone ||
        data.phoneNumber,
    ),
    phone: str(data.phone || data.phoneNumber || data.contactWhatsapp),
    email: str(data.email || data.contactEmail),
    address: str(data.address || data.storeAddress || data.businessAddress),
    instagramUrl: str(data.instagramUrl),
    facebookUrl: str(data.facebookUrl),
    tiktokUrl: str(data.tiktokUrl),

    primaryColor: str(data.primaryColor) || TALASE_PRIMARY,
    secondaryColor: str(data.secondaryColor) || TALASE_SECONDARY,
    accentColor: str(data.accentColor) || TALASE_ACCENT,

    templateId: str(data.templateId) || 'classic_store',
    productCardStyle: str(data.productCardStyle) || 'rounded_card',
    categoryLayout: str(data.categoryLayout) || 'horizontal',
    heroStyle: str(data.heroStyle) || 'split',
    productGrid: str(data.productGrid) || 'card_grid',
    fontFamily: str(data.fontFamily) || 'Inter',

    isPublished,
    showHero: data.showHero !== false,
    showCategories: data.showCategories !== false,
    showFeaturedProducts: data.showFeaturedProducts !== false,
    showLatestProducts: data.showLatestProducts !== false,
    showPromoSection: data.showPromoSection !== false,
    showAboutSection: data.showAboutSection !== false,
    showContactSection: data.showContactSection !== false,
    showTestimonials: data.showTestimonials === true,
    showFlashSale: data.showFlashSale === true,
    showPopularProducts: data.showPopularProducts !== false,
    showWhatsappButton: data.showWhatsappButton !== false,
    showSearchBar: data.showSearchBar !== false,
    showCategoryMenu: data.showCategoryMenu !== false,
  };
}

function normalizeThemeSettings(
  data: FirestoreRecord,
): StoreThemeSettings {
  const colorConfig = objectValue(data.colorConfig);
  const layoutConfig = objectValue(data.layoutConfig);
  const sectionConfig = objectValue(data.sectionConfig);
  const cardConfig = objectValue(data.cardConfig);
  const fontConfig = objectValue(data.fontConfig);

  const directPrimary = str(data.primaryColor || data.primary);
  const directSecondary = str(data.secondaryColor || data.secondary);
  const directAccent = str(data.accentColor || data.accent);
  const directProductCardStyle = str(data.productCardStyle);

  return {
    templateId: str(data.templateId) || 'classic_store',
    layoutConfig: {
      heroStyle: 'split',
      categoryStyle: 'horizontal',
      productGrid: 'card_grid',
      ...layoutConfig,
    },
    colorConfig: {
      primary: TALASE_PRIMARY,
      secondary: TALASE_SECONDARY,
      accent: TALASE_ACCENT,
      ...colorConfig,
      ...(directPrimary ? { primary: directPrimary } : {}),
      ...(directSecondary ? { secondary: directSecondary } : {}),
      ...(directAccent ? { accent: directAccent } : {}),
    },
    sectionConfig: {
      showFeatured: true,
      showLatest: true,
      showPromo: true,
      ...sectionConfig,
    },
    cardConfig: {
      productCardStyle: 'rounded_card',
      ...cardConfig,
      ...(directProductCardStyle
        ? { productCardStyle: directProductCardStyle }
        : {}),
    },
    fontConfig: {
      family: 'Inter',
      ...fontConfig,
    },
  };
}

function mergeThemeIntoStoreMeta(
  storeMeta: StoreMeta,
  themeSettings: StoreThemeSettings,
): StoreMeta {
  const colorConfig = themeSettings.colorConfig || {};
  const layoutConfig = themeSettings.layoutConfig || {};
  const cardConfig = themeSettings.cardConfig || {};
  const fontConfig = themeSettings.fontConfig || {};

  const primaryColor =
    str(colorConfig.primary) ||
    str(colorConfig.primaryColor) ||
    storeMeta.primaryColor ||
    TALASE_PRIMARY;

  const secondaryColor =
    str(colorConfig.secondary) ||
    str(colorConfig.secondaryColor) ||
    storeMeta.secondaryColor ||
    TALASE_SECONDARY;

  const accentColor =
    str(colorConfig.accent) ||
    str(colorConfig.accentColor) ||
    storeMeta.accentColor ||
    TALASE_ACCENT;

  const templateId =
    str(themeSettings.templateId) ||
    storeMeta.templateId ||
    'classic_store';

  const productCardStyle =
    str(cardConfig.productCardStyle) ||
    str(cardConfig.style) ||
    storeMeta.productCardStyle ||
    'rounded_card';

  const categoryLayout =
    str(layoutConfig.categoryStyle) ||
    str(layoutConfig.categoryLayout) ||
    storeMeta.categoryLayout ||
    'horizontal';

  const heroStyle =
    str(layoutConfig.heroStyle) ||
    storeMeta.heroStyle ||
    'split';

  const productGrid =
    str(layoutConfig.productGrid) ||
    storeMeta.productGrid ||
    'card_grid';

  const fontFamily =
    str(fontConfig.family) ||
    storeMeta.fontFamily ||
    'Inter';

  return {
    ...storeMeta,
    primaryColor,
    secondaryColor,
    accentColor,
    templateId,
    productCardStyle,
    categoryLayout,
    heroStyle,
    productGrid,
    fontFamily,
  };
}

function normalizePaymentSettings(
  data: FirestoreRecord,
): StorePaymentSettings {
  const bankName = str(data.bankName);
  const bankAccountNumber = str(data.bankAccountNumber);
  const bankAccountOwner = str(
    data.bankAccountOwner ||
      data.bankAccountName ||
      data.bankAccountOwnerName,
  );

  const qrisImageUrl = str(data.qrisImageUrl);
  const qrisName = str(data.qrisName || data.businessName);

  return {
    transferEnabled:
      data.transferEnabled === true ||
      Boolean(bankName && bankAccountNumber),

    bankName,
    bankAccountNumber,
    bankAccountOwner,

    qrisEnabled:
      data.qrisEnabled === true ||
      data.qrisActive === true ||
      Boolean(qrisImageUrl),

    qrisImageUrl,
    qrisName,
    qrisMerchantNumber: str(data.qrisMerchantNumber),
    paymentProofRequired: data.paymentProofRequired !== false,
  };
}

function buildCategoriesFromProducts(
  products: StoreProduct[],
): StoreCategory[] {
  const map = new Map<string, StoreCategory>();

  for (const product of products) {
    if (map.has(product.categorySlug)) continue;

    map.set(product.categorySlug, {
      id: product.categorySlug,
      slug: product.categorySlug,
      name: product.category,
      image: product.imageUrl || DEFAULT_IMAGE,
      description: `Pilihan produk kategori ${product.category}.`,
      sortOrder: product.sortOrder,
    });
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    return a.name.localeCompare(b.name);
  });
}

function mergeCategoryImages(
  categories: StoreCategory[],
  products: StoreProduct[],
): StoreCategory[] {
  return categories.map((category) => {
    const firstProduct = products.find(
      (product) => product.categorySlug === category.slug,
    );

    return {
      ...category,
      image:
        category.image && category.image !== DEFAULT_IMAGE
          ? category.image
          : firstProduct?.imageUrl || DEFAULT_IMAGE,
    };
  });
}

function resolveContentType(
  businessType: string,
  products: StoreProduct[],
): string {
  const text = [
    businessType,
    ...products.map((product) => product.category),
    ...products.map((product) => product.name),
  ]
    .join(' ')
    .toLowerCase();

  if (
    text.includes('makanan') ||
    text.includes('minuman') ||
    text.includes('kuliner') ||
    text.includes('resto') ||
    text.includes('restaurant') ||
    text.includes('cafe') ||
    text.includes('kafe') ||
    text.includes('warung') ||
    text.includes('dapur') ||
    text.includes('kitchen') ||
    text.includes('nasi') ||
    text.includes('ayam') ||
    text.includes('kopi') ||
    text.includes('teh') ||
    text.includes('snack')
  ) {
    return 'food';
  }

  if (
    text.includes('fashion') ||
    text.includes('pakaian') ||
    text.includes('baju') ||
    text.includes('kaos') ||
    text.includes('busana') ||
    text.includes('outfit') ||
    text.includes('sepatu') ||
    text.includes('tas')
  ) {
    return 'fashion';
  }

  if (
    text.includes('elektronik') ||
    text.includes('gadget') ||
    text.includes('hp') ||
    text.includes('komputer') ||
    text.includes('laptop')
  ) {
    return 'electronics';
  }

  if (
    text.includes('jasa') ||
    text.includes('service') ||
    text.includes('layanan') ||
    text.includes('laundry') ||
    text.includes('salon') ||
    text.includes('barbershop')
  ) {
    return 'service';
  }

  return 'product';
}

function sortLatestProducts(a: StoreProduct, b: StoreProduct): number {
  const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
  const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;

  if (aTime !== bTime) {
    return bTime - aTime;
  }

  return sortProducts(a, b);
}

function sortProducts(a: StoreProduct, b: StoreProduct): number {
  if (b.isFeatured !== a.isFeatured) {
    return Number(b.isFeatured) - Number(a.isFeatured);
  }

  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder;
  }

  return a.name.localeCompare(b.name);
}

function isPromotionCurrentlyActive(promotion: StorePromotion): boolean {
  if (!promotion.isActive) return false;

  const now = Date.now();
  const start = promotion.startAt ? Date.parse(promotion.startAt) : 0;
  const end = promotion.endAt ? Date.parse(promotion.endAt) : 0;

  if (start && now < start) return false;
  if (end && now > end) return false;

  return true;
}

async function safeRunQuery(query: FirestoreRecord): Promise<any[]> {
  try {
    const rows = await firestoreRunQuery(query);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('Firestore public query failed:', error);
    return [];
  }
}

function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function str(value: unknown): string {
  return value?.toString().trim() ?? '';
}

function numberValue(value: unknown): number {
  if (typeof value === 'number') return value;

  return Number(str(value).replace(/[^0-9.-]/g, '')) || 0;
}

function arrayString(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => str(item)).filter(Boolean);
}

function objectValue(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function dateString(value: unknown): string {
  if (!value) return '';

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }

  if (typeof value === 'object') {
    const record = value as Record<string, any>;

    if (record.seconds) {
      return new Date(Number(record.seconds) * 1000).toISOString();
    }

    if (record._seconds) {
      return new Date(Number(record._seconds) * 1000).toISOString();
    }

    if (record.timestampValue) {
      return str(record.timestampValue);
    }
  }

  return str(value);
}