import SiteShell from '@/components/site/SiteShell';
import Link from 'next/link';
import { apiFetch, formatIDR, waOrderUrl } from '@/lib/client';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produk — Chocolicious', description: 'Katalog lengkap produk Chocolicious: Cake, Brownies, Tiramisu, Mini Cheese Cake, Snack & Bread.' };

export default async function ProdukPage({ searchParams }) {
  const active = searchParams?.kategori || 'all';
  const [pr, ca] = await Promise.all([apiFetch('products'), apiFetch('categories')]);
  const products = pr.data || [];
  const categories = ca.data || [];
  const filtered = active === 'all' ? products : products.filter(p => p.category === active);
  return (
    <SiteShell>
      <section className="bg-cream-gradient border-b border-choco-cream">
        <div className="container py-14 text-center">
          <span className="eyebrow">KATALOG LENGKAP</span>
          <h1 className="section-title mt-2">Produk Chocolicious</h1>
          <p className="mt-3 text-choco-milk max-w-xl mx-auto">Filter berdasarkan kategori favoritmu.</p>
        </div>
      </section>
      <section className="container py-10">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Link href="/produk" className={`px-4 py-2 rounded-full text-sm font-medium transition ${active==='all' ? 'bg-choco-dark text-choco-cream' : 'bg-white border border-choco-cream text-choco-dark hover:border-choco-gold'}`}>Semua</Link>
          {categories.map(c => (
            <Link key={c.id} href={`/produk?kategori=${c.slug}`} className={`px-4 py-2 rounded-full text-sm font-medium transition ${active===c.slug ? 'bg-choco-dark text-choco-cream' : 'bg-white border border-choco-cream text-choco-dark hover:border-choco-gold'}`}>{c.name}</Link>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-choco-milk py-20">Tidak ada produk di kategori ini.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(p => (
              <div key={p.id} className="card-product group">
                <Link href={`/produk/${p.slug}`}>
                  <div className="aspect-square overflow-hidden bg-choco-cream"><img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/></div>
                </Link>
                <div className="p-4">
                  <span className="chip">{categories.find(c => c.slug === p.category)?.name || p.category}</span>
                  <h3 className="font-display text-lg text-choco-dark mt-2 line-clamp-1">{p.name}</h3>
                  <p className="font-semibold text-choco-milk mt-1">{formatIDR(p.price)}</p>
                  <a href={waOrderUrl(p.name)} target="_blank" rel="noopener" className="mt-3 w-full inline-flex items-center justify-center gap-1 bg-choco-dark text-choco-cream hover:bg-choco-milk rounded-full py-2 text-sm font-medium transition"><ShoppingBag size={14}/> Order</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
