import SiteShell from '@/components/site/SiteShell';
import Link from 'next/link';
import { apiFetch } from '@/lib/client';
import { Calendar, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Artikel — Chocolicious', description: 'Artikel seputar cake, tips hadiah, dan cerita Chocolicious.' };

export default async function ArtikelPage() {
  const r = await apiFetch('articles');
  const articles = r.data || [];
  return (
    <SiteShell>
      <section className="bg-cream-gradient border-b border-choco-cream">
        <div className="container py-14 text-center">
          <span className="eyebrow">BLOG & CERITA</span>
          <h1 className="section-title mt-2">Artikel Chocolicious</h1>
        </div>
      </section>
      <section className="container py-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(a => (
          <Link key={a.id} href={`/artikel/${a.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-choco-cream hover:shadow-xl transition">
            <div className="aspect-[16/10] overflow-hidden"><img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/></div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-choco-milk"><span className="chip">{a.category}</span><span className="flex items-center gap-1"><Calendar size={12}/>{new Date(a.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
              <h3 className="font-display text-xl text-choco-dark mt-3 line-clamp-2">{a.title}</h3>
              <p className="text-sm text-choco-milk mt-2 line-clamp-3">{a.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-choco-gold font-medium text-sm group-hover:gap-2 transition-all">Baca selengkapnya <ArrowRight size={14}/></span>
            </div>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
}
