'use client';
import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const r = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Gagal berlangganan');
      toast.success(d.message || 'Berhasil!');
      setEmail('');
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <p className="text-xs text-choco-cream/70 mb-1">Dapatkan promo & info produk baru</p>
      <div className="flex items-center gap-2 bg-choco-milk/25 rounded-full pl-3 pr-1 py-1 border border-choco-milk/30">
        <Mail size={14} className="text-choco-gold shrink-0"/>
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Anda" className="flex-1 bg-transparent text-sm py-2 outline-none placeholder:text-choco-cream/50 text-choco-cream min-w-0"/>
        <button disabled={loading} className="bg-choco-gold text-choco-dark px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#b88a4b] disabled:opacity-50 shrink-0 inline-flex items-center gap-1"><Send size={12}/>{loading ? '...' : 'Daftar'}</button>
      </div>
    </form>
  );
}
