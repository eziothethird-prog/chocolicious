export const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n || 0));

export const waOrderUrl = (productName) => {
  const msg = productName
    ? `Halo admin Chocolicious, saya tertarik untuk order *${productName}*. Mohon info stok dan cara order ya.`
    : 'Halo admin Chocolicious, saya ingin order';
  return `https://wa.me/6285111230286?text=${encodeURIComponent(msg)}`;
};

export async function apiFetch(path, opts = {}) {
  const base = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') : '';
  const res = await fetch(`${base}/api/${path}`, { cache: 'no-store', ...opts });
  if (!res.ok) return { data: null, error: await res.text() };
  return res.json();
}
