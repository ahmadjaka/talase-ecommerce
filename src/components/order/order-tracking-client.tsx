'use client';

import { useEffect } from 'react';

type Props = {
  orderCode: string;
  mitraId: string;
  subdomain: string;
  primaryColor: string;
  accentColor: string;
};

export function OrderTrackingClient({
  orderCode,
  mitraId,
  subdomain,
  primaryColor,
  accentColor,
}: Props) {
  useEffect(() => {
    async function init() {
      console.log('ORDER CLIENT RUN');
      console.log('orderCode:', orderCode);
      console.log('mitraId:', mitraId);
      console.log('subdomain:', subdomain);

      // pindahkan isi script lama ke sini
      // mulai dari firebase import sampai init()
    }

    init();
  }, [orderCode, mitraId, subdomain, primaryColor, accentColor]);

  return null;
}