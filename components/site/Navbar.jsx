'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

const nav = [
  { href: '/', label: 'Beranda' },
  { href: '/produk', label: 'Produk' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/cabang', label: 'Cabang' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-choco-cream">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-full bg-choco-dark text-choco-gold font-display font-bold text-xl flex items-center justify-center">C</span>
          <div className="leading-tight">
            <div className="font-display text-xl text-choco-dark font-semibold">Chocolicious</div>
            <div className="text-[10px] tracking-[0.2em] text-choco-milk uppercase">Premium Cookies & Cake</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-choco-dark hover:text-choco-gold transition">{n.label}</Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <a href="https://wa.me/6285111230286?text=Halo%20admin%20Chocolicious%2C%20saya%20ingin%20order" target="_blank" rel="noopener" className="btn-gold text-sm"><ShoppingBag size={16}/> Order WhatsApp</a>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">{open ? <X/> : <Menu/>}</button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-choco-cream bg-white">
          <div className="container py-4 flex flex-col gap-2">
            {nav.map(n => (
              <Link key={n.href} href={n.href} className="py-2 text-choco-dark font-medium" onClick={() => setOpen(false)}>{n.label}</Link>
            ))}
            <a href="https://wa.me/6285111230286?text=Halo%20admin%20Chocolicious%2C%20saya%20ingin%20order" target="_blank" rel="noopener" className="btn-gold text-sm w-fit mt-2"><ShoppingBag size={16}/> Order WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
}
