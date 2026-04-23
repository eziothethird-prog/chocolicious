import Link from 'next/link';
import SiteShell from '@/components/site/SiteShell';
import { apiFetch, formatIDR, waOrderUrl } from '@/lib/client';
import { Award, Flame, HeartHandshake, Sparkles, Star, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
  const [p, c, b, t, a] = await Promise.all([
    apiFetch('products?featured=true'),
    apiFetch('categories'),
    apiFetch('branches'),
    apiFetch('testimonials'),
    apiFetch('articles'),
  ]);
  return { products: p.data || [], categories: c.data || [], branches: b.data || [], testimonials: t.data || [], articles: a.data || [] };
}

export default async function HomePage() {
  const { products, categories, branches, testimonials, articles } = await getData();
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cream-gradient" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #C9A062 0%, transparent 40%), radial-gradient(circle at 80% 80%, #3E2416 0%, transparent 40%)' }} />
        <div className="container relative py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="eyebrow">• Premium Cookies & Cake • Halal</span>
            <h1 className="section-title mt-4 text-4xl md:text-6xl leading-[1.1]">Rayakan momen berharga bersama <em className="text-choco-gold not-italic">Chocolicious</em> Makassar</h1>
            <p className="mt-6 text-lg text-choco-milk max-w-xl leading-relaxed">90+ varian cake, brownies, tiramisu, dan snack tradisional yang dibuat dengan cinta. 7 outlet siap menemani momenmu.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waOrderUrl()} target="_blank" rel="noopener" className="btn-gold"><ShoppingBag size={18}/> Order Sekarang</a>
              <Link href="/produk" className="btn-dark">Lihat Katalog <ArrowRight size={16}/></Link>
            </div>
            <div className="mt-10 flex items-center gap-8">
              <div><div className="font-display text-3xl text-choco-dark font-bold">7</div><div className="text-xs uppercase tracking-wider text-choco-milk">Outlet</div></div>
              <div><div className="font-display text-3xl text-choco-dark font-bold">90+</div><div className="text-xs uppercase tracking-wider text-choco-milk">Produk</div></div>
              <div><div className="font-display text-3xl text-choco-dark font-bold">100%</div><div className="text-xs uppercase tracking-wider text-choco-milk">Halal</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img src="https://chocolicious.id/img/uploads/rayakan-momen-berharga-bersama-orang-terdekat-dengan-mini-cake-spesial-dari-chocolicious.webp" alt="Mini Cake Chocolicious" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-choco-cream">
              <div className="w-12 h-12 rounded-full bg-choco-gold flex items-center justify-center"><Award className="text-choco-dark" size={20}/></div>
              <div><div className="font-semibold text-choco-dark text-sm">Sertifikasi Halal</div><div className="text-xs text-choco-milk">Resmi sejak berdiri</div></div>
            </div>
            <div className="absolute -top-4 -right-4 bg-choco-dark text-choco-cream rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-1 text-choco-gold">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
              <div className="text-xs mt-1">Rating pelanggan</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-16 md:py-20">
        <div className="text-center mb-12">
          <span className="eyebrow">OUR PRODUCT</span>
          <h2 className="section-title mt-2">Created with love for your precious moment</h2>
          <p className="mt-3 text-choco-milk max-w-2xl mx-auto">Jelajahi kategori produk Chocolicious yang kami hadirkan dengan kualitas premium dan rasa yang selalu konsisten.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.slice(0, 8).map(c => {
            const prod = products.find(p => p.category === c.slug);
            return (
              <Link key={c.id} href={`/produk?kategori=${c.slug}`} className="card-product group">
                <div className="aspect-square overflow-hidden bg-choco-cream">
                  <img src={prod?.image || 'https://chocolicious.id/img/produk/CAKE/cake_blackforest.webp'} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-display text-lg text-choco-dark font-semibold">{c.name}</h3>
                  <p className="text-xs text-choco-milk mt-1 line-clamp-1">{c.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* USP */}
      <section className="bg-choco-dark text-choco-cream py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">KENAPA CHOCOLICIOUS</span>
            <h2 className="font-display text-3xl md:text-5xl text-choco-cream mt-2">Alasan mengapa mereka memilih kami</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Flame size={28}/>, title: 'Kualitas Cokelat Premium', desc: 'Biji kakao pilihan diolah dengan hati-hati untuk rasa kaya dan lezat.' },
              { icon: <Sparkles size={28}/>, title: 'Inovasi Rasa Unik', desc: 'Kreativitas dalam menggabungkan bahan berkualitas tinggi untuk pengalaman rasa baru.' },
              { icon: <HeartHandshake size={28}/>, title: 'Sertifikasi Halal', desc: 'Semua produk bersertifikat Halal resmi dan aman dikonsumsi seluruh keluarga.' },
            ].map((it, i) => (
              <div key={i} className="bg-choco-milk/20 border border-choco-milk/40 rounded-2xl p-8 hover:bg-choco-milk/30 transition">
                <div className="w-14 h-14 rounded-full bg-choco-gold text-choco-dark flex items-center justify-center mb-5">{it.icon}</div>
                <h3 className="font-display text-xl font-semibold text-choco-gold">{it.title}</h3>
                <p className="text-sm text-choco-cream/80 mt-3 leading-relaxed">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="eyebrow">PRODUK UNGGULAN</span>
            <h2 className="section-title mt-2">Best seller Chocolicious</h2>
          </div>
          <Link href="/produk" className="text-choco-milk hover:text-choco-gold font-medium inline-flex items-center gap-1">Lihat semua <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.slice(0, 8).map(p => (
            <div key={p.id} className="card-product group">
              <Link href={`/produk/${p.slug}`}>
                <div className="aspect-square overflow-hidden bg-choco-cream">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                </div>
              </Link>
              <div className="p-4">
                <span className="chip">{p.category}</span>
                <h3 className="font-display text-lg text-choco-dark mt-2 line-clamp-1">{p.name}</h3>
                <p className="font-semibold text-choco-milk mt-1">{formatIDR(p.price)}</p>
                <a href={waOrderUrl(p.name)} target="_blank" rel="noopener" className="mt-3 w-full inline-flex items-center justify-center gap-1 bg-choco-dark text-choco-cream hover:bg-choco-milk rounded-full py-2 text-sm font-medium transition"><ShoppingBag size={14}/> Order</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-cream-gradient py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow">TESTIMONIAL</span>
            <h2 className="section-title mt-2">What our customers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-lg shadow-choco-milk/10 border border-choco-cream">
                <div className="flex items-center gap-1 text-choco-gold mb-4">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
                <p className="text-choco-dark italic leading-relaxed">“{t.message}”</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-choco-cream">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover"/>
                  <div><div className="font-semibold text-choco-dark">{t.name}</div><div className="text-xs text-choco-milk">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANCHES PREVIEW */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <span className="eyebrow">OUTLET KAMI</span>
          <h2 className="section-title mt-2">Temukan outlet Chocolicious terdekat</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {branches.slice(0, 4).map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-5 border border-choco-cream hover:border-choco-gold transition">
              <MapPin className="text-choco-gold" size={22}/>
              <h3 className="font-display text-lg text-choco-dark mt-3">{b.name}</h3>
              <p className="text-sm text-choco-milk mt-1 line-clamp-2">{b.address}</p>
              <p className="text-xs text-choco-milk/70 mt-2">{b.hours}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8"><Link href="/cabang" className="btn-dark">Lihat semua cabang <ArrowRight size={16}/></Link></div>
      </section>

      {/* ARTICLES */}
      <section className="bg-choco-dark text-choco-cream py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="eyebrow">ARTIKEL</span>
              <h2 className="font-display text-3xl md:text-5xl mt-2">Cerita manis dari Chocolicious</h2>
            </div>
            <Link href="/artikel" className="text-choco-gold hover:text-choco-cream font-medium inline-flex items-center gap-1">Semua artikel <ArrowRight size={16}/></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map(a => (
              <Link key={a.id} href={`/artikel/${a.slug}`} className="group bg-choco-milk/15 rounded-2xl overflow-hidden border border-choco-milk/30 hover:bg-choco-milk/25 transition">
                <div className="aspect-[16/10] overflow-hidden"><img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/></div>
                <div className="p-5">
                  <span className="chip bg-choco-gold/20 text-choco-gold">{a.category}</span>
                  <h3 className="font-display text-xl mt-3 text-choco-cream line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-choco-cream/70 mt-2 line-clamp-2">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="bg-choco-gold rounded-[2rem] p-10 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-choco-dark">Siap membuat momen manismu?</h2>
          <p className="mt-3 text-choco-dark/80 max-w-xl mx-auto">Pesan sekarang via WhatsApp. Tim kami akan bantu pilihkan cake terbaik untuk momenmu.</p>
          <a href={waOrderUrl()} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 bg-choco-dark text-choco-cream font-semibold px-8 py-4 rounded-full hover:bg-choco-milk transition"><ShoppingBag size={18}/> Chat WhatsApp Sekarang</a>
        </div>
      </section>
    </SiteShell>
  );
}
