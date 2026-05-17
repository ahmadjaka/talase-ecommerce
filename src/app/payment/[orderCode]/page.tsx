import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  ClipboardCopy,
  CreditCard,
  FileImage,
  Info,
  QrCode,
  ReceiptText,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

import { StoreHeader } from '@/components/layout/store-header';
import { StoreFooter } from '@/components/layout/store-footer';

import { resolveSubdomain } from '@/lib/store-resolver';
import { formatCurrency } from '@/lib/format';

async function getStoreData(subdomain: string | null, orderCode: string) {
  const items = [
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

  const subtotal = items.reduce(
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
    order: {
      orderCode,
      customerName: 'Budi Santoso',
      paymentMethod: 'transfer',
      paymentStatus: 'waiting_confirmation',
      createdAt: '17 Mei 2026, 12:30 WIB',
      subtotal,
      discount,
      shippingCost,
      total,
      items,
    },
    paymentSettings: {
      bankName: 'BCA',
      bankAccountNumber: '1234567890',
      bankAccountOwner: 'TOKODEMO STORE',
      qrisName: 'TOKODEMO STORE',
      qrisMerchantNumber: 'NMID123456789',
      qrisImageUrl:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
      paymentProofRequired: true,
    },
  };
}

export default async function PaymentPage({
  params,
}: {
  params: { orderCode: string };
}) {
  const headerList = await headers();
  const hostname = headerList.get('host') || '';

  const subdomain = resolveSubdomain(hostname);
  const store = await getStoreData(subdomain, params.orderCode);
  const order = store.order;
  const payment = store.paymentSettings;

  return (
    <main className="min-h-screen bg-[#F6FAF7] text-[#1E293B]">
      <StoreHeader
        businessName={store.businessName}
        businessType={store.businessType}
      />

      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <Link
            href={`/order/${order.orderCode}`}
            className="inline-flex items-center gap-2 text-sm font-black text-[#009A3E]"
          >
            <ArrowLeft size={17} />
            Kembali ke tracking order
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Instruksi Pembayaran
              </h1>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#64748B] md:text-base">
                Selesaikan pembayaran sesuai metode yang dipilih, lalu tunggu konfirmasi dari toko.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FFF1E6] px-4 py-2 text-sm font-black text-[#FF7A1A]">
              <ReceiptText size={17} />
              {order.orderCode}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-white shadow-sm">
            <div className="bg-gradient-to-br from-[#009A3E] via-[#007A32] to-[#0B4F8A] p-6 text-white md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide backdrop-blur-md">
                <ShieldCheck size={15} />
                Menunggu Konfirmasi
              </div>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                Total Pembayaran {formatCurrency(order.total)}
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/85 md:text-base">
                Pembayaran akan dikonfirmasi manual oleh toko setelah dana atau bukti pembayaran diterima.
              </p>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
              <StatusInfo
                icon={<CreditCard size={20} />}
                title="Metode"
                value="Transfer Bank"
              />

              <StatusInfo
                icon={<ReceiptText size={20} />}
                title="Kode Order"
                value={order.orderCode}
              />

              <StatusInfo
                icon={<CheckCircle2 size={20} />}
                title="Status"
                value="Menunggu Konfirmasi"
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  Transfer Bank
                </h2>

                <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                  Transfer sesuai nominal total ke rekening toko berikut.
                </p>
              </div>

              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E] md:flex">
                <Banknote size={26} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <PaymentInfo
                label="Bank"
                value={payment.bankName}
              />

              <PaymentInfo
                label="Atas Nama"
                value={payment.bankAccountOwner}
              />

              <div className="md:col-span-2">
                <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-[#94A3B8]">
                    Nomor Rekening
                  </p>

                  <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-3xl font-black tracking-wide text-[#1E293B]">
                      {payment.bankAccountNumber}
                    </p>

                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-5 py-3 text-sm font-black text-white shadow-lg">
                      Salin
                      <ClipboardCopy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  QRIS Statis
                </h2>

                <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                  Jika memilih QRIS, scan QR toko dan lakukan pembayaran sesuai total.
                </p>
              </div>

              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E] md:flex">
                <QrCode size={26} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[260px_1fr] md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC]">
                <Image
                  src={payment.qrisImageUrl}
                  alt={payment.qrisName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <PaymentInfo label="Nama QRIS" value={payment.qrisName} />
                <PaymentInfo
                  label="Merchant"
                  value={payment.qrisMerchantNumber}
                />

                <div className="rounded-2xl bg-[#FFF1E6] p-4">
                  <div className="flex gap-3">
                    <Info size={20} className="mt-1 shrink-0 text-[#FF7A1A]" />
                    <p className="text-sm font-semibold leading-7 text-[#92400E]">
                      QRIS ini adalah QRIS statis milik toko. Pastikan nominal pembayaran sesuai total order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  Upload Bukti Pembayaran
                </h2>

                <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                  Upload bukti transfer atau pembayaran QRIS agar toko lebih mudah melakukan konfirmasi.
                </p>
              </div>

              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E] md:flex">
                <FileImage size={26} />
              </div>
            </div>

            <div className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#009A3E] shadow-sm">
                <UploadCloud size={30} />
              </div>

              <h3 className="mt-5 text-xl font-black text-[#1E293B]">
                Pilih File Bukti Pembayaran
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-[#64748B]">
                Format gambar JPG/PNG. Bukti pembayaran akan dikirim ke toko untuk proses konfirmasi manual.
              </p>

              <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-lg">
                Upload Bukti
                <UploadCloud size={17} />
              </button>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[32px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-black">
            Ringkasan Pesanan
          </h2>

          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
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
                  <h3 className="line-clamp-2 text-sm font-black text-[#1E293B]">
                    {item.name}
                  </h3>

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
            <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
            <SummaryRow label="Diskon" value={`- ${formatCurrency(order.discount)}`} />
            <SummaryRow
              label="Ongkir"
              value={
                order.shippingCost > 0
                  ? formatCurrency(order.shippingCost)
                  : 'Diatur toko'
              }
            />

            <div className="border-t border-dashed border-[#CBD5E1] pt-4">
              <SummaryRow
                label="Total Bayar"
                value={formatCurrency(order.total)}
                bold
              />
            </div>
          </div>

          <Link
            href={`/order/${order.orderCode}`}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009A3E] px-6 py-4 text-sm font-black text-white shadow-xl transition hover:scale-[1.01]"
          >
            Tracking Order
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/products"
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#1E293B] transition hover:bg-[#F8FAFC]"
          >
            Belanja Lagi
          </Link>
        </aside>
      </section>

      <StoreFooter businessName={store.businessName} />
    </main>
  );
}

function StatusInfo({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#009A3E]">
        {icon}
      </div>

      <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#94A3B8]">
        {title}
      </p>

      <h3 className="mt-1 text-sm font-black text-[#1E293B]">
        {value}
      </h3>
    </div>
  );
}

function PaymentInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <p className="text-xs font-black uppercase tracking-wide text-[#94A3B8]">
        {label}
      </p>

      <h3 className="mt-2 text-lg font-black text-[#1E293B]">
        {value}
      </h3>
    </div>
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