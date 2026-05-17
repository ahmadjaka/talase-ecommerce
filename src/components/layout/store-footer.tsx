import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Store,
  Twitter,
} from 'lucide-react';

type StoreFooterProps = {
  businessName: string;
};

export function StoreFooter({ businessName }: StoreFooterProps) {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8 md:py-12">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#009A3E] via-[#007A32] to-[#0B4F8A] text-white shadow-lg">
              <Store size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-[#1E293B]">
                {businessName}
              </h2>
              <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
                Official Ecommerce Store
              </p>
            </div>
          </Link>

          <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-[#64748B]">
            Toko online profesional untuk memudahkan pelanggan melihat produk,
            checkout, dan memantau pesanan secara cepat.
          </p>

          <div className="mt-5 flex gap-3">
            <SocialButton icon={<Instagram size={17} />} />
            <SocialButton icon={<Facebook size={17} />} />
            <SocialButton icon={<Twitter size={17} />} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#1E293B]">
            Menu Toko
          </h3>

          <div className="mt-5 space-y-3">
            <FooterLink href="/" label="Beranda" />
            <FooterLink href="/products" label="Semua Produk" />
            <FooterLink href="/cart" label="Keranjang" />
            <FooterLink href="/checkout" label="Checkout" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#1E293B]">
            Kontak
          </h3>

          <div className="mt-5 space-y-4">
            <ContactItem
              icon={<Phone size={17} />}
              text="0812-3456-7890"
            />
            <ContactItem
              icon={<Mail size={17} />}
              text="admin@talase.id"
            />
            <ContactItem
              icon={<MapPin size={17} />}
              text="Alamat toko ditampilkan sesuai pengaturan mitra."
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#E2E8F0]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm font-semibold text-[#64748B] md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 {businessName}. Semua hak dilindungi.</p>

          <p>
            Powered by{' '}
            <span className="font-black text-[#009A3E]">
              Talase
            </span>{' '}
            #BantuBisnisNaikKelas
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="block text-sm font-semibold text-[#64748B] transition hover:text-[#009A3E]"
    >
      {label}
    </Link>
  );
}

function ContactItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex gap-3 text-sm font-semibold leading-6 text-[#64748B]">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F7EE] text-[#009A3E]">
        {icon}
      </div>

      <p>{text}</p>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#009A3E] hover:text-[#009A3E]">
      {icon}
    </button>
  );
}