import Link from 'next/link';
import { Instagram, Facebook, MapPin, Mail, Phone } from 'lucide-react';
import NewsletterForm from '@/components/site/NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-choco-dark text-choco-cream mt-24">
      <div className="container py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-full bg-choco-gold text-choco-dark font-display font-bold text-xl flex items-center justify-center">C</span>
            <div className="font-display text-xl font-semibold">Chocolicious</div>
          </div>
          <p className="text-sm text-choco-cream/70 leading-relaxed">Premium Cookies & Cake — Halal dan dibuat dengan cinta untuk momen berharga Anda. 7 outlet tersebar di Makassar dan sekitarnya.</p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4 text-choco-gold">Halaman</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/produk" className="hover:text-choco-gold">Produk</Link></li>
            <li><Link href="/tentang" className="hover:text-choco-gold">Tentang Kami</Link></li>
            <li><Link href="/cabang" className="hover:text-choco-gold">Cabang</Link></li>
            <li><Link href="/artikel" className="hover:text-choco-gold">Artikel</Link></li>
            <li><Link href="/faq" className="hover:text-choco-gold">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4 text-choco-gold">Kontak</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 text-choco-gold"/><span>+62 851 1123 0286</span></li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 text-choco-gold"/><span>firstahmadthahir@gmail.com</span></li>
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 text-choco-gold"/><span>Makassar, Sulawesi Selatan</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4 text-choco-gold">Newsletter</h4>
          <NewsletterForm />
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-choco-milk/30 hover:bg-choco-gold hover:text-choco-dark flex items-center justify-center transition"><Instagram size={18}/></a>
            <a href="https://facebook.com" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-choco-milk/30 hover:bg-choco-gold hover:text-choco-dark flex items-center justify-center transition"><Facebook size={18}/></a>
          </div>
          <p className="text-xs mt-4 text-choco-cream/60">Bersertifikat Halal • Sejak 2017</p>
        </div>
      </div>
      <div className="border-t border-choco-milk/40">
        <div className="container py-5 text-xs text-choco-cream/60 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} PT. Berkah Bersama Gemilang. All rights reserved.</span>
          <span>Redesigned with ♡ by Ahmad Thahir</span>
        </div>
      </div>
    </footer>
  );
}
