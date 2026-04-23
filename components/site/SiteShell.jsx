'use client';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import FloatingWA from '@/components/site/FloatingWA';

export default function SiteShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <FloatingWA />
    </>
  );
}
