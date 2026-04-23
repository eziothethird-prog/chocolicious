import SiteShell from '@/components/site/SiteShell';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export const metadata = { title: 'Kontak — Chocolicious', description: 'Hubungi tim Chocolicious untuk pertanyaan, pesanan custom, atau kerjasama.' };

export default function KontakPage() {
  return (
    <SiteShell>
      <section className="bg-cream-gradient border-b border-choco-cream">
        <div className="container py-14 text-center">
          <span className="eyebrow">HUBUNGI KAMI</span>
          <h1 className="section-title mt-2">Kami selalu siap membantu</h1>
        </div>
      </section>
      <section className="container py-14 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <a href="https://wa.me/6285111230286" target="_blank" rel="noopener" className="block bg-white rounded-2xl p-6 border border-choco-cream hover:border-choco-gold transition">
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center"><MessageCircle/></div><div><div className="font-display text-xl text-choco-dark">WhatsApp</div><div className="text-choco-milk mt-1">+62 851 1123 0286</div></div></div>
          </a>
          <a href="tel:+6285111230286" className="block bg-white rounded-2xl p-6 border border-choco-cream hover:border-choco-gold transition">
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-full bg-choco-gold text-choco-dark flex items-center justify-center"><Phone/></div><div><div className="font-display text-xl text-choco-dark">Telepon</div><div className="text-choco-milk mt-1">+62 851 1123 0286</div></div></div>
          </a>
          <a href="mailto:firstahmadthahir@gmail.com" className="block bg-white rounded-2xl p-6 border border-choco-cream hover:border-choco-gold transition">
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-full bg-choco-dark text-choco-cream flex items-center justify-center"><Mail/></div><div><div className="font-display text-xl text-choco-dark">Email</div><div className="text-choco-milk mt-1">firstahmadthahir@gmail.com</div></div></div>
          </a>
          <div className="bg-white rounded-2xl p-6 border border-choco-cream">
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-full bg-choco-milk text-choco-cream flex items-center justify-center"><MapPin/></div><div><div className="font-display text-xl text-choco-dark">Kantor Pusat</div><div className="text-choco-milk mt-1">Makassar, Sulawesi Selatan</div><div className="text-xs text-choco-milk/70 mt-1">PT. Berkah Bersama Gemilang</div></div></div>
          </div>
        </div>
        <div className="aspect-square lg:aspect-auto rounded-2xl overflow-hidden">
          <iframe src="https://maps.google.com/maps?q=Makassar&z=12&output=embed" className="w-full h-full min-h-[400px]" loading="lazy"/>
        </div>
      </section>
    </SiteShell>
  );
}
