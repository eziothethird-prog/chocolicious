import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata = {
  title: 'Chocolicious — Premium Cookies & Cake di Makassar',
  description: 'Toko kue premium Halal di Makassar dengan 90+ varian cake, brownies, tiramisu & snack tradisional. 7 outlet siap melayani.',
  openGraph: {
    title: 'Chocolicious — Premium Cookies & Cake di Makassar',
    description: 'Rayakan momen berharga dengan cake premium Halal dari Chocolicious.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
