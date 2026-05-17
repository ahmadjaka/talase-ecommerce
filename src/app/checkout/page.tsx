import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  User,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import { resolveSubdomain } from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

async function getStoreData(subdomain: string | null) {
  const cartItems = [
    {
      id: '1',
      slug: 'kopi-arabica-premium',
      name: 'Kopi Arabica Premium',
      imageUrl:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      price: 45000,
      qty: 2,
    },
    {
      id: '2',
      slug: 'paket-snack-umkm',
      name: 'Paket Snack UMKM',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      price: 25000,
      qty: 1,
    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const discount = 10000;
  const shippingCost = 0;
  const total = subtotal - discount + shippingCost;

  return {
    businessName: subdomain
      ? `${subdomain.toUpperCase()} Store`
      : 'Talase Store',
    businessType: 'Official Ecommerce Store',
    cartItems,
    subtotal,
    discount,
    shippingCost,
    total,
  };
}

export default async function CheckoutPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStoreData(subdomain);

  return (
    <main className="min-h-screen bg-[#F6FAF7] text-[#1E293B]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-black text-[#009A3E]"
          >
            <ArrowLeft size={17} />
            Kembali ke keranjang
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Checkout Pesanan
              </h1>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Lengkapi data pembeli, validasi nomor WhatsApp, lalu pilih metode pembayaran.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E8F7EE] px-4 py-2 text-sm font-black text-[#009A3E]">
              <ShieldCheck size={17} />
              Checkout Aman
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <CheckoutStep
            number="1"
            title="Data Pembeli"
            subtitle="Data ini digunakan toko untuk memproses pesanan Anda."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InputBox
                icon={<User size={18} />}
                label="Nama Pembeli"
                value="Budi Santoso"
              />

              <InputBox
                icon={<Smartphone size={18} />}
                label="Nomor WhatsApp"
                value="081234567890"
              />

              <div className="md:col-span-2">
                <InputBox
                  icon={<MapPin size={18} />}
                  label="Alamat Lengkap"
                  value="Jl. Merdeka No. 10, Kecamatan, Kabupaten"
                />
              </div>

              <div className="md:col-span-2">
                <InputBox
                  icon={<MessageCircle size={18} />}
                  label="Catatan Pesanan"
                  value="Tolong dikemas rapi."
                />
              </div>
            </div>
          </CheckoutStep>

          <CheckoutStep
            number="2"
            title="Validasi WhatsApp"
            subtitle="Nomor WhatsApp pembeli wajib diverifikasi OTP sebelum pesanan dibuat."
          >
            <div className="rounded-[26px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F7EE] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#009A3E]">
                    <BadgeCheck size={15} />
                    OTP WhatsApp
                  </div>

                  <h3 className="mt-4 text-xl font-black text-[#1E293B]">
                    Verifikasi Nomor Pembeli
                  </h3>

                  <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                    Kode OTP akan dikirim melalui Fonnte ke nomor WhatsApp pembeli.
                  </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.01]">
                  Kirim OTP
                  <ArrowRight size={17} />
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[#94A3B8]">
                    Kode OTP
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#94A3B8]">
                    Masukkan 6 digit kode OTP
                  </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#1E293B] transition hover:bg-[#F8FAFC]">
                  Verifikasi
                  <CheckCircle2 size={17} />
                </button>
              </div>
            </div>
          </CheckoutStep>

          <CheckoutStep
            number="3"
            title="Metode Pembayaran"
            subtitle="Talase V1 menggunakan transfer manual dan QRIS statis."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <PaymentCard
                icon={<Banknote size={24} />}
                title="Transfer Bank"
                subtitle="Pembeli transfer ke rekening toko, lalu toko konfirmasi manual."
                active
              />

              <PaymentCard
                icon={<QrCode size={24} />}
                title="QRIS Statis"
                subtitle="Pembeli scan QRIS toko dan upload bukti pembayaran jika diminta."
              />
            </div>
          </CheckoutStep>
        </div>

        <aside className="h-fit rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-black">Ringkasan Order</h2>

          <div className="mt-5 space-y-4">
            {store.cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[58px_1fr_auto] gap-3 rounded-2xl bg-[#F8FAFC] p-3"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div>
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="line-clamp-2 text-sm font-black text-[#1E293B]">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="mt-1 text-xs font-bold text-[#64748B]">
                    {item.qty} x {formatCurrency(item.price)}
                  </p>
                </div>

                <p className="text-right text-sm font-black text-[#1E293B]">
                  {formatCurrency(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <SummaryRow label="Subtotal" value={formatCurrency(store.subtotal)} />
            <SummaryRow label="Diskon" value={`- ${formatCurrency(store.discount)}`} />
            <SummaryRow
              label="Ongkir"
              value={
                store.shippingCost > 0
                  ? formatCurrency(store.shippingCost)
                  : 'Diatur toko'
              }
            />

            <div className="border-t border-dashed border-[#CBD5E1] pt-4">
              <SummaryRow
                label="Total"
                value={formatCurrency(store.total)}
                bold
              />
            </div>
          </div>

          <Link
            href="/payment/TLS-2026-0001"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-xl transition hover:scale-[1.01]"
          >
            Buat Pesanan
            <ArrowRight size={18} />
          </Link>

          <div className="mt-5 rounded-2xl bg-[#FFF1E6] p-4">
            <div className="flex gap-3">
              <CreditCard size={20} className="mt-1 text-[#FF7A1A]" />

              <p className="text-sm font-semibold leading-7 text-[#92400E]">
                Setelah pesanan dibuat, pembeli akan melihat instruksi pembayaran dan tracking order.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <StoreFooter businessName={store.businessName} />
    </main>
  );
}

function CheckoutStep({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#009A3E] text-lg font-black text-white">
          {number}
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#1E293B]">
            {title}
          </h2>

          <p className="mt-1 text-sm font-semibold leading-7 text-[#64748B]">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function InputBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4">
      <div className="flex items-center gap-2 text-[#009A3E]">
        {icon}
        <p className="text-xs font-black uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-bold text-[#1E293B]">
        {value}
      </p>
    </div>
  );
}

function PaymentCard({
  icon,
  title,
  subtitle,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <button
      className={`rounded-[26px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl ${
        active
          ? 'border-[#009A3E] bg-[#E8F7EE]'
          : 'border-[#E2E8F0] bg-white'
      }`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
          active
            ? 'bg-[#009A3E] text-white'
            : 'bg-[#F1F5F9] text-[#64748B]'
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-black text-[#1E293B]">
        {title}
      </h3>

      <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
        {subtitle}
      </p>
    </button>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p
        className={
          bold
            ? 'text-base font-black text-[#1E293B]'
            : 'text-sm font-bold text-[#64748B]'
        }
      >
        {label}
      </p>

      <p
        className={
          bold
            ? 'text-2xl font-black text-[#009A3E]'
            : 'text-sm font-black text-[#1E293B]'
        }
      >
        {value}
      </p>
    </div>
  );
}