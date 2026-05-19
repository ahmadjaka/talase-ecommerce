import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Store,
} from 'lucide-react';

type StoreFooterProps = {
  businessName: string;
  businessType?: string;
  contentType?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  primaryColor?: string;
  accentColor?: string;
};

export function StoreFooter({
  businessName,
  contentType = 'product',
  phone = '',
  whatsapp = '',
  email = '',
  address = '',
  instagramUrl = '',
  facebookUrl = '',
  tiktokUrl = '',
  primaryColor = '#009A3E',
  accentColor = '#FF7A1A',
  }: StoreFooterProps) {
  const footerCopy = getFooterCopy(contentType);
  const cleanWhatsapp = normalizePhone(whatsapp || phone);
  const phoneText = phone || whatsapp;

  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
                 style={{ backgroundColor: primaryColor }}>
              <Store size={28} />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#1E293B]">
                {businessName}
              </h3>
              <p className="text-xs font-black uppercase tracking-widest text-[#64748B]">
                {footerCopy.badge}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-xl text-sm font-semibold leading-7 text-[#64748B]">
            {footerCopy.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:opacity-80"
                style={{ color: primaryColor }}
                aria-label="Instagram"
              >
                <Instagram size={19} />
              </a>
            )}

            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:border-[#009A3E] hover:text-[#009A3E]"
                aria-label="Facebook"
              >
                <Facebook size={19} />
              </a>
            )}

            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] text-xs font-black text-[#64748B] transition hover:border-[#009A3E] hover:text-[#009A3E]"
                aria-label="TikTok"
              >
                TT
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-[#1E293B]">
            Menu Toko
          </h4>

          <div className="mt-5 grid gap-3 text-sm font-bold text-[#64748B]">
            <Link href="/" className="hover:text-[#009A3E]">
              Beranda
            </Link>
            <Link href="/products" className="hover:text-[#009A3E]">
              {footerCopy.allItems}
            </Link>
            <Link href="/cart" className="hover:text-[#009A3E]">
              Keranjang
            </Link>
            <Link href="/checkout" className="hover:text-[#009A3E]">
              Checkout
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-[#1E293B]">
            Kontak
          </h4>

          <div className="mt-5 grid gap-4 text-sm font-bold text-[#64748B]">
            {phoneText && (
              <a
                href={
                  cleanWhatsapp
                    ? `https://wa.me/${cleanWhatsapp}`
                    : `tel:${phoneText}`
                }
                target={cleanWhatsapp ? '_blank' : undefined}
                rel={cleanWhatsapp ? 'noreferrer' : undefined}
                className="flex items-center gap-3 hover:text-[#009A3E]"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: `${primaryColor}14`,
                    color: primaryColor,
                  }}
                >
                  <Phone size={18} />
                </span>
                {phoneText}
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 hover:text-[#009A3E]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E]">
                  <Mail size={18} />
                </span>
                {email}
              </a>
            )}

            {address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-[#009A3E]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E]">
                  <MapPin size={18} />
                </span>
                {address}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#E2E8F0]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm font-bold text-[#64748B] md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 {businessName}. Semua hak dilindungi.</p>
          <p>
            Powered by <span className="font-black" style={{ color: primaryColor }}>Talase</span>{' '}
            <span className="text-[#64748B]"></span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function getFooterCopy(contentType: string) {
  if (contentType === 'food') {
    return {
      badge: 'Toko Kuliner Online',
      description:
        'Pilih menu favorit, cek detail pesanan, dan pesan makanan atau minuman dengan lebih praktis.',
      allItems: 'Semua Menu',
    };
  }

  if (contentType === 'fashion') {
    return {
      badge: 'Toko Fashion Online',
      description:
        'Temukan koleksi favorit, pilih model yang sesuai, dan belanja fashion dengan lebih mudah.',
      allItems: 'Semua Koleksi',
    };
  }

  if (contentType === 'service') {
    return {
      badge: 'Layanan Online',
      description:
        'Pilih layanan yang Anda butuhkan dan ajukan pemesanan dengan lebih cepat dan praktis.',
      allItems: 'Semua Layanan',
    };
  }

  return {
    badge: 'Toko Online',
    description:
      'Temukan pilihan terbaik, cek detail, dan pesan kebutuhan Anda dengan lebih mudah.',
    allItems: 'Semua Produk',
  };
}

function normalizePhone(value: string) {
  const cleaned = value.replace(/[^0-9]/g, '');

  if (!cleaned) return '';
  if (cleaned.startsWith('0')) return `62${cleaned.slice(1)}`;
  if (cleaned.startsWith('62')) return cleaned;

  return cleaned;
}