import SiteShell from '@/components/site/SiteShell';
import Link from 'next/link';
import { apiFetch, formatIDR, waOrderUrl } from '@/lib/client';
import { ShoppingBag, ChevronRight, Check } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const r = await apiFetch(`products/${params.slug}`);
  const p = r?.data;
  if (!p) return { title: 'Produk — Chocolicious' };
  return { title: `${p.name} — Chocolicious`, description: p.description?.slice(0, 160) };
}

export default async function ProdukDetail({ params }) {
  const r = await apiFetch(`products/${params.slug}`);
  if (!r?.data) return notFound();
  const p = r.data;
  const relR = await apiFetch(`products?category=${p.category}`);
  const related = (relR.data || []).filter(x => x.id !== p.id).slice(0, 4);
  return (
    <SiteShell>
      <section className="container py-10">
        <nav className="text-sm text-choco-milk flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-choco-gold">Beranda</Link><ChevronRight size={14}/>
          <Link href="/produk" className="hover:text-choco-gold">Produk</Link><ChevronRight size={14}/>
          <span className="text-choco-dark">{p.name}</span>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="aspect-square rounded-3xl overflow-hidden bg-choco-cream shadow-xl"><img src={p.image} alt={p.name} className="w-full h-full object-cover"/></div>
          <div>
            <span className="chip">{p.category}</span>
            <h1 className="font-display text-4xl md:text-5xl text-choco-dark mt-3">{p.name}</h1>
            <div className="text-2xl md:text-3xl font-semibold text-choco-milk mt-4">{formatIDR(p.price)}</div>
            <p className="mt-6 text-choco-dark/80 leading-relaxed whitespace-pre-line">{p.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-choco-dark">
              <li className="flex items-center gap-2"><Check size={16} className="text-choco-gold"/> Bersertifikat Halal resmi</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-choco-gold"/> Dibuat fresh dari outlet Chocolicious</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-choco-gold"/> Pemesanan mudah via WhatsApp</li>
            </ul>
            <a href={waOrderUrl(p.name)} target="_blank" rel="noopener" className="btn-gold mt-8"><ShoppingBag size={18}/> Order via WhatsApp</a>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="container py-14 border-t border-choco-cream">
          <h2 className="section-title text-2xl md:text-3xl mb-8">Produk lain di kategori yang sama</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(x => (
              <Link key={x.id} href={`/produk/${x.slug}`} className="card-product group">
                <div className="aspect-square overflow-hidden bg-choco-cream"><img src={x.image} alt={x.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/></div>
                <div className="p-4"><h3 className="font-display text-lg text-choco-dark line-clamp-1">{x.name}</h3><p className="text-sm text-choco-milk mt-1">{formatIDR(x.price)}</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
