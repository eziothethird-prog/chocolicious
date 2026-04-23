import SiteShell from '@/components/site/SiteShell';
import Link from 'next/link';
import { apiFetch } from '@/lib/client';
import { ChevronRight, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const r = await apiFetch(`articles/${params.slug}`);
  const a = r?.data;
  if (!a) return { title: 'Artikel — Chocolicious' };
  return { title: a.meta_title || a.title, description: a.meta_description || a.excerpt };
}

export default async function ArtikelDetail({ params }) {
  const r = await apiFetch(`articles/${params.slug}`);
  if (!r?.data) return notFound();
  const a = r.data;
  return (
    <SiteShell>
      <article className="container py-10">
        <nav className="text-sm text-choco-milk flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-choco-gold">Beranda</Link><ChevronRight size={14}/>
          <Link href="/artikel" className="hover:text-choco-gold">Artikel</Link><ChevronRight size={14}/>
          <span className="text-choco-dark line-clamp-1">{a.title}</span>
        </nav>
        <div className="max-w-3xl mx-auto">
          <span className="chip">{a.category}</span>
          <h1 className="font-display text-3xl md:text-5xl text-choco-dark mt-3 leading-tight">{a.title}</h1>
          <div className="flex items-center gap-3 text-xs text-choco-milk mt-4"><Calendar size={14}/>{new Date(a.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div className="aspect-[16/9] rounded-2xl overflow-hidden my-8"><img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover"/></div>
          <div className="prose prose-lg max-w-none text-choco-dark/90 leading-relaxed whitespace-pre-line">{a.content}</div>
        </div>
      </article>
    </SiteShell>
  );
}
