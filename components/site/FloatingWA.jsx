'use client';
import { MessageCircle } from 'lucide-react';

export default function FloatingWA({ text = 'Halo admin Chocolicious, saya ingin order' }) {
  const href = `https://wa.me/6285111230286?text=${encodeURIComponent(text)}`;
  return (
    <a href={href} target="_blank" rel="noopener" className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl shadow-green-500/30 transition-transform hover:scale-110" aria-label="Order via WhatsApp">
      <MessageCircle size={26} />
    </a>
  );
}
