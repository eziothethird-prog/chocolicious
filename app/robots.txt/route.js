export function GET() {
  const content = `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${process.env.NEXT_PUBLIC_BASE_URL || ''}/sitemap.xml\n`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain' } });
}
