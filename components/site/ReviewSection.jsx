'use client';
import { useEffect, useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

function Stars({ value = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'text-choco-gold fill-choco-gold' : 'text-choco-cream'}/>
      ))}
    </div>
  );
}

export default function ReviewSection({ slug }) {
  const [data, setData] = useState({ data: [], count: 0, average: 0 });
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const r = await fetch(`/api/products/${slug}/reviews`, { cache: 'no-store' });
      const d = await r.json();
      if (r.ok) setData(d);
    } catch {}
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slug]);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return toast.error('Nama dan ulasan wajib diisi');
    setSubmitting(true);
    try {
      const r = await fetch(`/api/products/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment, rating }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Gagal mengirim ulasan');
      toast.success(d.message || 'Ulasan terkirim');
      setName(''); setComment(''); setRating(5);
      load();
    } catch (e) { toast.error(e.message); }
    finally { setSubmitting(false); }
  }

  return (
    <section className="container py-14 border-t border-choco-cream">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="eyebrow">ULASAN PELANGGAN</span>
          <h2 className="section-title text-2xl md:text-3xl mt-2">Apa kata mereka</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-display text-4xl text-choco-dark">{data.average.toFixed(1)}</div>
          <div>
            <Stars value={data.average} size={18}/>
            <p className="text-xs text-choco-milk mt-1">{data.count} ulasan</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {data.data.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-choco-cream">
              <MessageSquare className="mx-auto text-choco-milk mb-3" size={28}/>
              <p className="text-choco-milk">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>
            </div>
          )}
          {data.data.map(rv => (
            <div key={rv.id} className="bg-white rounded-2xl p-5 border border-choco-cream">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-choco-dark">{rv.name}</div>
                <Stars value={rv.rating}/>
              </div>
              <p className="text-sm text-choco-dark/80 mt-2 leading-relaxed">{rv.comment}</p>
              <div className="text-xs text-choco-milk/70 mt-3">{new Date(rv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="bg-choco-dark text-choco-cream rounded-2xl p-6 h-fit">
          <h3 className="font-display text-xl text-choco-gold">Tulis ulasan</h3>
          <p className="text-xs text-choco-cream/70 mt-1">Ulasan akan ditampilkan setelah disetujui admin.</p>
          <label className="block mt-4">
            <span className="text-sm">Nama</span>
            <input value={name} onChange={e=>setName(e.target.value)} required className="mt-1 w-full px-3 py-2 rounded-lg bg-choco-milk/20 border border-choco-milk/40 text-choco-cream placeholder:text-choco-cream/50 focus:outline-none focus:border-choco-gold" placeholder="Nama Anda"/>
          </label>
          <label className="block mt-3">
            <span className="text-sm">Rating</span>
            <div className="mt-1 flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button" onClick={()=>setRating(i)} className="p-0.5" aria-label={`${i} star`}>
                  <Star size={24} className={i <= rating ? 'text-choco-gold fill-choco-gold' : 'text-choco-cream/30'}/>
                </button>
              ))}
            </div>
          </label>
          <label className="block mt-3">
            <span className="text-sm">Ulasan</span>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} required rows={4} className="mt-1 w-full px-3 py-2 rounded-lg bg-choco-milk/20 border border-choco-milk/40 text-choco-cream placeholder:text-choco-cream/50 focus:outline-none focus:border-choco-gold" placeholder="Bagaimana pengalaman Anda?"/>
          </label>
          <button disabled={submitting} className="mt-4 w-full btn-gold justify-center disabled:opacity-60"><Send size={14}/>{submitting ? 'Mengirim...' : 'Kirim ulasan'}</button>
        </form>
      </div>
    </section>
  );
}
