'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
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

import { formatCurrency } from '@/lib/format';

type Product = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  stockQty: number;
  stockEnabled: boolean;
  isOutOfStock: boolean;
  unit: string;
};

type CartItem = Product & {
  qty: number;
  note: string;
};

type AppliedVoucher = {
  promotionId: string;
  code: string;
  title: string;
  discountAmount: number;
};

type PaymentSettings = {
  transferEnabled: boolean;
  qrisEnabled: boolean;
  paymentProofRequired: boolean;

  bankName?: string;
  bankAccountNumber?: string;
  bankAccountOwner?: string;

  qrisName?: string;
  qrisImageUrl?: string;
  qrisMerchantNumber?: string;
};

const CART_KEY = 'talase_cart';
const CHECKOUT_KEY = 'talase_checkout_draft';

export function CheckoutClient({
  products,
  subdomain,
  mitraId,
  primaryColor,
  accentColor,
  paymentSettings,
}: {
  products: Product[];
  subdomain: string;
  mitraId: string;
  primaryColor: string;
  accentColor: string;
  paymentSettings: PaymentSettings;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(
    paymentSettings.transferEnabled
      ? 'transfer'
      : paymentSettings.qrisEnabled
        ? 'qris'
        : '',
  );

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const cart = Array.isArray(parsed) ? parsed : [];

    const normalized = cart
      .map((item) => {
        const product = products.find(
          (p) => p.slug === item.slug || p.id === item.id,
        );

        const source = product || item;

        if (!source || source.isOutOfStock) return null;

        return {
          id: source.id || item.id,
          slug: source.slug || item.slug,
          name: source.name || item.name,
          imageUrl: source.imageUrl || item.imageUrl,
          price: Number(source.price || item.price || 0),
          stockQty: Number(source.stockQty || item.stockQty || 0),
          stockEnabled: source.stockEnabled === true,
          isOutOfStock: source.isOutOfStock === true,
          unit: source.unit || item.unit || '',
          qty: Math.max(1, Number(item.qty || 1)),
          note: item.note || '',
        };
      })
      .filter(Boolean) as CartItem[];

    setItems(normalized);
  }, [products]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );

  const discount = appliedVoucher?.discountAmount || 0;
  const shippingCost = 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  function normalizePhone62(value: string) {
    let phone = value.replace(/[^0-9]/g, '');

    if (phone.startsWith('0')) phone = `62${phone.slice(1)}`;
    if (phone.startsWith('8')) phone = `62${phone}`;

    return phone;
  }

  async function callFunction<T>(
    name: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
      throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID belum diset.');
    }

    const res = await fetch(
      `https://asia-southeast2-${projectId}.cloudfunctions.net/${name}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      },
    );

    const json = await res.json();

    if (!res.ok || json.error) {
      throw new Error(
        json.error?.message || json.message || 'Request gagal diproses.',
      );
    }

    return json.result as T;
  }

  async function requestOtp() {
    try {
      setLoading(true);
      setMessage('');

      const phone62 = normalizePhone62(customerPhone);

      if (phone62.length < 10 || phone62.length > 15) {
        throw new Error('Nomor WhatsApp tidak valid.');
      }

      await callFunction('requestCheckoutOtp', {
        phone: phone62,
        subdomain,
      });

      setMessage('Kode OTP berhasil dikirim ke WhatsApp pembeli.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Gagal mengirim OTP.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    try {
      setLoading(true);
      setMessage('');

      const phone62 = normalizePhone62(customerPhone);

      if (otp.length !== 6) {
        throw new Error('Masukkan 6 digit kode OTP.');
      }

      await callFunction('verifyCheckoutOtp', {
        phone: phone62,
        otp,
        subdomain,
      });

      setOtpVerified(true);
      setMessage('Nomor WhatsApp berhasil diverifikasi.');
    } catch (e) {
      setOtpVerified(false);
      setMessage(e instanceof Error ? e.message : 'OTP tidak valid.');
    } finally {
      setLoading(false);
    }
  }

  async function applyVoucher() {
    try {
      setLoading(true);
      setMessage('');

      const code = voucherCode.trim().toUpperCase();

      if (!code) {
        throw new Error('Kode voucher wajib diisi.');
      }

      if (!mitraId) {
        throw new Error('Data toko belum siap.');
      }

      const result = await callFunction<{
        success: boolean;
        promotion: {
          promotionId: string;
          title: string;
          code: string;
          discountAmount: number;
        };
      }>('validatePromotionCode', {
        mitraId,
        code,
        subtotal,
      });

      setAppliedVoucher({
        promotionId: result.promotion.promotionId,
        code: result.promotion.code,
        title: result.promotion.title,
        discountAmount: Number(result.promotion.discountAmount || 0),
      });

      setVoucherCode(result.promotion.code);
      setMessage('Voucher berhasil diterapkan.');
    } catch (e) {
      setAppliedVoucher(null);
      setMessage(e instanceof Error ? e.message : 'Voucher tidak valid.');
    } finally {
      setLoading(false);
    }
  }

  function removeVoucher() {
    setAppliedVoucher(null);
    setVoucherCode('');
    setMessage('');
  }

  async function createOrder() {
    try {
      setLoading(true);
      setMessage('');

      const phone62 = normalizePhone62(customerPhone);

      if (items.length < 1) throw new Error('Keranjang masih kosong.');
      if (!customerName.trim()) throw new Error('Nama pembeli wajib diisi.');
      if (!phone62) throw new Error('Nomor WhatsApp wajib diisi.');
      if (!customerAddress.trim()) throw new Error('Alamat wajib diisi.');
      if (!paymentMethod) throw new Error('Pilih metode pembayaran.');
      if (!otpVerified) throw new Error('Verifikasi OTP WhatsApp terlebih dahulu.');

      const result = await callFunction<{
        success: boolean;
        orderId: string;
        orderCode: string;
        total: number;
        paymentStatus: string;
        orderStatus: string;
      }>('createOnlineOrder', {
        subdomain,
        customerName,
        customerPhone: phone62,
        customerAddress,
        customerNote,
        paymentMethod,
        promotionCode: appliedVoucher?.code || '',
        otp,
        items: items.map((item) => ({
          productId: item.id,
          qty: item.qty,
          note: item.note || '',
        })),
      });

      const savedOrder = {
        orderCode: result.orderCode,
        orderId: result.orderId,
        customerName,
        customerPhone: phone62,
        customerAddress,
        customerNote,
        paymentMethod,
        paymentStatus: result.paymentStatus,
        orderStatus: result.orderStatus,
        subtotal,
        discount,
        voucherDiscount: discount,
        promotionCode: appliedVoucher?.code || '',
        promotionId: appliedVoucher?.promotionId || '',
        promotionTitle: appliedVoucher?.title || '',
        shippingCost,
        total: result.total,
        items,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(CHECKOUT_KEY, JSON.stringify(savedOrder));
      localStorage.setItem(
        `talase_order_${result.orderCode}`,
        JSON.stringify(savedOrder),
      );

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event('talase-cart-updated'));
      const orderCodesRaw = localStorage.getItem('talase_order_codes');
      const orderCodes = orderCodesRaw ? JSON.parse(orderCodesRaw) : [];

      const nextOrderCodes = Array.from(
        new Set([result.orderCode, ...orderCodes]),
      ).slice(0, 20);

      localStorage.setItem(
        'talase_order_codes',
        JSON.stringify(nextOrderCodes),
      );

      document.cookie = `talase_order_codes=${encodeURIComponent(
        JSON.stringify(nextOrderCodes),
      )}; path=/; max-age=31536000; SameSite=Lax`;

      window.location.href = `/order/${encodeURIComponent(result.orderCode)}`;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Gagal membuat pesanan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <StepHeader
            number="1"
            title="Data Pembeli"
            subtitle="Data ini digunakan toko untuk memproses pesanan Anda."
            primaryColor={primaryColor}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <InputBox
              icon={<User size={18} />}
              label="Nama Pembeli"
              value={customerName}
              onChange={setCustomerName}
              placeholder="Masukkan nama pembeli"
              primaryColor={primaryColor}
            />

            <InputBox
              icon={<Smartphone size={18} />}
              label="Nomor WhatsApp"
              value={customerPhone}
              onChange={(v) => {
                setCustomerPhone(v);
                setOtpVerified(false);
              }}
              placeholder="Contoh: 081234567890"
              primaryColor={primaryColor}
            />

            <div className="md:col-span-2">
              <InputBox
                icon={<MapPin size={18} />}
                label="Alamat Lengkap"
                value={customerAddress}
                onChange={setCustomerAddress}
                placeholder="Masukkan alamat lengkap"
                primaryColor={primaryColor}
              />
            </div>

            <div className="md:col-span-2">
              <InputBox
                icon={<MessageCircle size={18} />}
                label="Catatan Pesanan"
                value={customerNote}
                onChange={setCustomerNote}
                placeholder="Catatan opsional untuk toko"
                primaryColor={primaryColor}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <StepHeader
            number="2"
            title="Validasi WhatsApp"
            subtitle="Nomor WhatsApp pembeli wajib diverifikasi OTP sebelum pesanan dibuat."
            primaryColor={primaryColor}
          />

          <div className="rounded-[26px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide"
                  style={{ backgroundColor: '#FFF1E6', color: accentColor }}
                >
                  <BadgeCheck size={15} />
                  OTP WhatsApp
                </div>

                <h3 className="mt-4 text-xl font-black text-[#102033]">
                  Verifikasi Nomor Pembeli
                </h3>

                <p className="mt-2 text-sm font-semibold leading-7 text-[#64748B]">
                  Kode OTP dikirim ke WhatsApp pembeli melalui Fonnte.
                </p>
              </div>

              <button
                onClick={requestOtp}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-lg disabled:opacity-60"
                style={{ backgroundColor: primaryColor }}
              >
                Kirim OTP
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                }
                inputMode="numeric"
                maxLength={6}
                placeholder="Masukkan 6 digit kode OTP"
                className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-4 text-sm font-bold text-[#102033] outline-none placeholder:text-[#94A3B8]"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-4 text-sm font-black text-[#102033] disabled:opacity-60"
              >
                Verifikasi
                <CheckCircle2 size={17} />
              </button>
            </div>

            {otpVerified && (
              <p className="mt-4 rounded-2xl bg-[#DCFCE7] px-4 py-3 text-sm font-bold text-[#166534]">
                WhatsApp sudah terverifikasi.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <StepHeader
            number="3"
            title="Metode Pembayaran"
            subtitle="Talase V1 menggunakan transfer manual dan QRIS statis."
            primaryColor={primaryColor}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <PaymentCard
              active={paymentMethod === 'transfer'}
              enabled={paymentSettings.transferEnabled}
              icon={<Banknote size={24} />}
              title="Transfer Bank"
              subtitle={
                paymentSettings.transferEnabled
                  ? `${paymentSettings.bankName || 'Bank'} • ${
                      paymentSettings.bankAccountNumber || '-'
                    }`
                  : 'Transfer bank belum diaktifkan.'
              }
              primaryColor={primaryColor}
              onClick={() => setPaymentMethod('transfer')}
            />

            {paymentMethod === 'transfer' &&
              paymentSettings.transferEnabled && (
                <div className="md:col-span-2">
                  <div className="rounded-[26px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                    <div className="rounded-2xl bg-white p-5">
                      <p className="text-xs font-black uppercase tracking-wide text-[#64748B]">
                        Bank Transfer
                      </p>

                      <h3 className="mt-2 text-2xl font-black text-[#102033]">
                        {paymentSettings.bankName}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <p
                          className="text-3xl font-black"
                          style={{ color: primaryColor }}
                        >
                          {paymentSettings.bankAccountNumber}
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              paymentSettings.bankAccountNumber || '',
                            );

                            alert('Nomor rekening berhasil disalin.');
                          }}
                          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-xs font-black transition hover:bg-[#F8FAFC]"
                          style={{
                            borderColor: primaryColor,
                            color: primaryColor,
                            backgroundColor: 'transparent',
                          }}
                        >
                          Salin
                        </button>
                      </div>

                      {paymentSettings.bankAccountOwner && (
                        <p className="mt-2 text-sm font-bold text-[#64748B]">
                          a/n {paymentSettings.bankAccountOwner}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
            )}

            <PaymentCard
              active={paymentMethod === 'qris'}
              enabled={paymentSettings.qrisEnabled}
              icon={<QrCode size={24} />}
              title="QRIS Statis"
              subtitle={
                paymentSettings.qrisEnabled
                  ? paymentSettings.qrisName || 'Scan QRIS'
                  : 'QRIS belum diaktifkan.'
              }
              primaryColor={primaryColor}
              onClick={() => setPaymentMethod('qris')}
            />
            {paymentMethod === 'qris' &&
              paymentSettings.qrisEnabled &&
              paymentSettings.qrisImageUrl && (
                <div className="md:col-span-2">
                  <div className="rounded-[26px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative h-[240px] w-[240px] overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-3">
                        <Image
                          src={paymentSettings.qrisImageUrl}
                          alt="QRIS"
                          fill
                          className="object-contain p-3"
                        />
                      </div>

                      <p className="mt-4 text-center text-sm font-bold text-[#64748B]">
                        Scan QRIS untuk melakukan pembayaran.
                      </p>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-[30px] border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
        <h2 className="text-2xl font-black">Ringkasan Order</h2>

        <div className="mt-5 space-y-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
              <p className="text-sm font-black text-[#102033]">
                Keranjang kosong
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex rounded-xl px-4 py-3 text-xs font-black text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Lihat Produk
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.slug}
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
                  <h3 className="line-clamp-2 text-sm font-black text-[#102033]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-[#64748B]">
                    {item.qty} x {formatCurrency(item.price)}
                  </p>
                </div>

                <p className="text-right text-sm font-black text-[#102033]">
                  {formatCurrency(item.price * item.qty)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <label className="text-xs font-black uppercase tracking-wide text-[#64748B]">
              Kode Voucher
            </label>

            <div className="mt-3 flex gap-2">
              <input
                value={voucherCode}
                onChange={(event) => {
                  setVoucherCode(event.target.value.toUpperCase());
                  setAppliedVoucher(null);
                }}
                disabled={loading || appliedVoucher !== null}
                placeholder="Contoh: HEMAT10"
                className="min-w-0 flex-1 rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm font-bold outline-none disabled:opacity-70"
              />

              <button
                type="button"
                onClick={appliedVoucher ? removeVoucher : applyVoucher}
                disabled={loading || items.length === 0}
                className="rounded-xl px-4 py-3 text-xs font-black text-white disabled:opacity-60"
                style={{
                  backgroundColor: appliedVoucher ? '#EF4444' : primaryColor,
                }}
              >
                {appliedVoucher ? 'Hapus' : 'Pakai'}
              </button>
            </div>

            {appliedVoucher && (
              <p className="mt-3 rounded-xl bg-[#DCFCE7] px-3 py-2 text-xs font-bold text-[#166534]">
                Voucher {appliedVoucher.code} berhasil digunakan. Potongan{' '}
                {formatCurrency(appliedVoucher.discountAmount)}
              </p>
            )}
          </div>

          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
          <SummaryRow label="Diskon" value={`- ${formatCurrency(discount)}`} />
          <SummaryRow label="Ongkir" value="Diatur toko" />

          <div className="border-t border-dashed border-[#CBD5E1] pt-4">
            <SummaryRow label="Total" value={formatCurrency(total)} bold />
          </div>
        </div>

        <button
          onClick={createOrder}
          disabled={loading || items.length === 0}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-white shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? 'Memproses...' : 'Buat Pesanan'}
          <ArrowRight size={18} />
        </button>

        {message && (
          <p className="mt-4 rounded-2xl bg-[#FFF1E6] px-4 py-3 text-sm font-bold text-[#92400E]">
            {message}
          </p>
        )}

        <div className="mt-5 rounded-2xl bg-[#FFF1E6] p-4">
          <div className="flex gap-3">
            <CreditCard size={20} className="mt-1 text-[#FF7A1A]" />
            <p className="text-sm font-semibold leading-7 text-[#92400E]">
              Setelah pesanan dibuat, pembeli diarahkan ke instruksi pembayaran
              dan toko menerima notifikasi pesanan online.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function StepHeader({
  number,
  title,
  subtitle,
  primaryColor,
}: {
  number: string;
  title: string;
  subtitle: string;
  primaryColor: string;
}) {
  return (
    <div className="mb-5 flex gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white"
        style={{ backgroundColor: primaryColor }}
      >
        {number}
      </div>

      <div>
        <h2 className="text-2xl font-black text-[#102033]">{title}</h2>
        <p className="mt-1 text-sm font-semibold leading-7 text-[#64748B]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function InputBox({
  icon,
  label,
  value,
  onChange,
  placeholder,
  primaryColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  primaryColor: string;
}) {
  return (
    <label className="block rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4">
      <div className="flex items-center gap-2" style={{ color: primaryColor }}>
        {icon}
        <p className="text-xs font-black uppercase tracking-wide">{label}</p>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent text-sm font-bold text-[#102033] outline-none placeholder:text-[#94A3B8]"
      />
    </label>
  );
}

function PaymentCard({
  icon,
  title,
  subtitle,
  enabled,
  active,
  primaryColor,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  enabled: boolean;
  active: boolean;
  primaryColor: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      className="rounded-[26px] border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        borderColor: active ? primaryColor : '#E2E8F0',
        backgroundColor: active ? '#F8FAFC' : '#FFFFFF',
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: active ? primaryColor : '#F1F5F9',
          color: active ? '#FFFFFF' : '#64748B',
        }}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-black text-[#102033]">{title}</h3>
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
            ? 'text-base font-black text-[#102033]'
            : 'text-sm font-bold text-[#64748B]'
        }
      >
        {label}
      </p>

      <p
        className={
          bold
            ? 'text-2xl font-black text-[#073B70]'
            : 'text-sm font-black text-[#102033]'
        }
      >
        {value}
      </p>
    </div>
  );
}