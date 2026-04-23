import SiteShell from '@/components/site/SiteShell';
import { apiFetch } from '@/lib/client';
import { MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Cabang — Chocolicious', description: '7 outlet Chocolicious tersebar di Makassar dan sekitarnya.' };

export default async function CabangPage() {
  const r = await apiFetch('branches');
  const branches = r.data || [];
  return (
    <SiteShell>
      <section className="bg-cream-gradient border-b border-choco-cream">
        <div className="container py-14 text-center">
          <span className="eyebrow">OUTLET KAMI</span>
          <h1 className="section-title mt-2">Cabang Chocolicious</h1>
          <p className="mt-3 text-choco-milk">Temukan outlet terdekat untuk menikmati cake favoritmu.</p>
        </div>
      </section>
      <section className="container py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(b => (
            <div key={b.id} className="bg-white rounded-2xl overflow-hidden border border-choco-cream hover:shadow-xl transition">
              <div className="aspect-[16/9] bg-choco-cream">
                <iframe src={`https://maps.google.com/maps?q=${b.lat},${b.lng}&z=15&output=embed`} className="w-full h-full" loading="lazy"/>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-choco-dark">{b.name}</h3>
                <div className="mt-3 space-y-2 text-sm text-choco-dark/80">
                  <p className="flex gap-2"><MapPin size={16} className="text-choco-gold mt-0.5 shrink-0"/>{b.address}</p>
                  <p className="flex gap-2"><Clock size={16} className="text-choco-gold mt-0.5 shrink-0"/>{b.hours}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <a href={`https://wa.me/${b.whatsapp}?text=Halo%20admin%20Chocolicious%20${encodeURIComponent(b.name)}`} target="_blank" rel="noopener" className="flex-1 inline-flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white rounded-full py-2 text-sm font-medium transition"><MessageCircle size={14}/> WhatsApp</a>
                  <a href={b.mapsUrl} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1 bg-choco-dark text-choco-cream rounded-full px-4 py-2 text-sm hover:bg-choco-milk transition"><ExternalLink size={14}/> Maps</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
