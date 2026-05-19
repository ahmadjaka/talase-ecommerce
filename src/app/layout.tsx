import type { Metadata } from 'next';
import { headers } from 'next/headers';

import '@/styles/globals.css';

import {
  getStorefrontData,
  resolveSubdomain,
} from '@/lib/store-resolver';

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();

  const host =
    headerStore.get('x-forwarded-host') ||
    headerStore.get('host') ||
    '';

  const subdomain = resolveSubdomain(host);

  const store = await getStorefrontData(subdomain);

  return {
    title: store.businessName || 'Talase Store',
    description:
      store.siteDescription ||
      `Belanja online di ${store.businessName}`,

    icons: store.logoUrl
      ? {
          icon: store.logoUrl,
          shortcut: store.logoUrl,
          apple: store.logoUrl,
        }
      : undefined,

    openGraph: {
      title: store.businessName || 'Talase Store',
      description:
        store.siteDescription ||
        `Belanja online di ${store.businessName}`,
      images: store.logoUrl ? [store.logoUrl] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}