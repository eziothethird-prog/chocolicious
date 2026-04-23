import { NextResponse } from 'next/server';
import { getObject } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const parts = params?.path || [];
    const path = parts.join('/');
    if (!path) return NextResponse.json({ error: 'missing path' }, { status: 400 });
    const { data, contentType } = await getObject(path);
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'not found', detail: String(e.message || e) }, { status: 404 });
  }
}
