import SiteShell from '@/components/site/SiteShell';
import { apiFetch } from '@/lib/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'FAQ — Chocolicious', description: 'Pertanyaan yang sering ditanyakan pelanggan Chocolicious.' };

export default async function FAQPage() {
  const r = await apiFetch('faqs');
  const faqs = r.data || [];
  return (
    <SiteShell>
      <section className="bg-cream-gradient border-b border-choco-cream">
        <div className="container py-14 text-center">
          <span className="eyebrow">FAQ</span>
          <h1 className="section-title mt-2">Pertanyaan yang sering ditanyakan</h1>
        </div>
      </section>
      <section className="container py-14 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map(f => (
            <AccordionItem key={f.id} value={f.id} className="bg-white rounded-2xl border border-choco-cream px-5">
              <AccordionTrigger className="text-left font-display text-lg text-choco-dark hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="text-choco-dark/80 leading-relaxed">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteShell>
  );
}
