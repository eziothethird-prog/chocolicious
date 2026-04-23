import { apiFetch } from '@/lib/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://chocolicious.id';
  const staticPages = ['', 'produk', 'tentang', 'cabang', 'artikel', 'faq', 'kontak'];
  const [p, a] = await Promise.all([apiFetch('products'), apiFetch('articles')]);
  const products = (p.data || []).map(x => `${baseUrl}/produk/${x.slug}`);
  const articles = (a.data || []).map(x => `${baseUrl}/artikel/${x.slug}`);
  const all = [...staticPages.map(s => `${baseUrl}/${s}`), ...products, ...articles];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
