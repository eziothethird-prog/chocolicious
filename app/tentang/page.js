import SiteShell from '@/components/site/SiteShell';
import { Award, HeartHandshake, Sparkles } from 'lucide-react';
export const metadata = { title: 'Tentang Kami — Chocolicious', description: 'Sejarah & visi Chocolicious, brand cake Halal premium dari Makassar.' };

export default function TentangPage() {
  return (
    <SiteShell>
      <section className="bg-cream-gradient border-b border-choco-cream">
        <div className="container py-16 text-center">
          <span className="eyebrow">TENTANG KAMI</span>
          <h1 className="section-title mt-2">Chocolicious — Manisnya momen, kualitas premium</h1>
        </div>
      </section>
      <section className="container py-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-3xl text-choco-dark">Perjalanan kami sejak 2017</h2>
          <p className="mt-4 text-choco-dark/80 leading-relaxed">Chocolicious lahir dari kecintaan pada cita rasa cokelat berkualitas dan komitmen untuk menghadirkan produk Halal premium bagi masyarakat Makassar. Dikelola oleh <strong>PT. Berkah Bersama Gemilang</strong>, Chocolicious kini memiliki 7 outlet tersebar di Makassar dan sekitarnya.</p>
          <p className="mt-4 text-choco-dark/80 leading-relaxed">Viral sejak 2017 dan terus berinovasi, kami percaya bahwa setiap gigitan harus membawa kebahagiaan — untuk momen ulang tahun, hadiah kecil, atau sekadar menemani hari-harimu.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://chocolicious.id/img/produk/CAKE/cake_blackforest.webp" alt="Cake" className="rounded-2xl aspect-square object-cover"/>
          <img src="https://chocolicious.id/img/produk/TIRAMISUCAKE/variantiramisu.webp" alt="Tiramisu" className="rounded-2xl aspect-square object-cover mt-8"/>
          <img src="https://chocolicious.id/img/produk/BROWNIES/brownies_vulcano.webp" alt="Brownies" className="rounded-2xl aspect-square object-cover"/>
          <img src="https://chocolicious.id/img/produk/MINICHEESECAKE/mini_cheesestrawberry.webp" alt="Mini cheese" className="rounded-2xl aspect-square object-cover mt-8"/>
        </div>
      </section>
      <section className="bg-choco-dark text-choco-cream py-16">
        <div className="container grid md:grid-cols-3 gap-6">
          <div className="bg-choco-milk/20 rounded-2xl p-8">
            <Award className="text-choco-gold mb-3"/>
            <h3 className="font-display text-xl text-choco-gold">Visi</h3>
            <p className="mt-2 text-sm text-choco-cream/80">Menjadi brand cake & cookies Halal nomor satu di Indonesia Timur yang dicintai lintas generasi.</p>
          </div>
          <div className="bg-choco-milk/20 rounded-2xl p-8">
            <HeartHandshake className="text-choco-gold mb-3"/>
            <h3 className="font-display text-xl text-choco-gold">Misi</h3>
            <p className="mt-2 text-sm text-choco-cream/80">Menghadirkan produk premium berkualitas, menjaga kehalalan, dan terus berinovasi untuk momen berharga pelanggan.</p>
          </div>
          <div className="bg-choco-milk/20 rounded-2xl p-8">
            <Sparkles className="text-choco-gold mb-3"/>
            <h3 className="font-display text-xl text-choco-gold">Nilai</h3>
            <p className="mt-2 text-sm text-choco-cream/80">Kualitas, keikhlasan, dan kebersamaan dalam setiap gigitan yang kami sajikan.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
