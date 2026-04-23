import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongo';
import { SEED } from '@/lib/seed';
import { v4 as uuid } from 'uuid';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'firstahmadthahir@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chocolicious2026';

const COLLECTIONS = ['categories', 'products', 'branches', 'testimonials', 'articles', 'faqs', 'tokens'];

let seedPromise = null;
async function ensureSeed(db) {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const marker = await db.collection('meta').findOne({ key: 'seeded' });
    if (marker) return;
    // double-check by counting
    const catCount = await db.collection('categories').countDocuments();
    if (catCount > 0) {
      try { await db.collection('meta').insertOne({ key: 'seeded', at: new Date().toISOString() }); } catch {}
      return;
    }
    const bulkInserts = [
      ['categories', SEED.categories],
      ['products', SEED.products],
      ['branches', SEED.branches],
      ['testimonials', SEED.testimonials],
      ['articles', SEED.articles],
      ['faqs', SEED.faqs],
    ];
    for (const [name, data] of bulkInserts) {
      if (data.length) {
        try { await db.collection(name).insertMany(data, { ordered: false }); } catch (e) { /* ignore duplicates */ }
      }
    }
    try { await db.collection('meta').insertOne({ key: 'seeded', at: new Date().toISOString() }); } catch {}
  })();
  try { await seedPromise; } finally { /* keep cached success */ }
}

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function getAuthUser(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const db = await getDb();
  const row = await db.collection('tokens').findOne({ token });
  if (!row) return null;
  if (row.expiresAt && new Date(row.expiresAt) < new Date()) return null;
  return row;
}

function strip(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
}

export async function OPTIONS() { return json({ ok: true }); }

async function handle(req, { params }) {
  const db = await getDb();
  await ensureSeed(db);
  const path = (params?.path || []).join('/');
  const method = req.method;
  const url = new URL(req.url);

  // --- PUBLIC API ---
  if (method === 'GET' && path === 'health') return json({ status: 'ok', service: 'chocolicious-api' });

  if (method === 'GET' && path === 'categories') {
    const rows = await db.collection('categories').find({}).toArray();
    return json({ data: rows.map(strip) });
  }

  if (method === 'GET' && path === 'products') {
    const cat = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const q = { active: true };
    if (cat) q.category = cat;
    if (featured === 'true') q.featured = true;
    const rows = await db.collection('products').find(q).toArray();
    return json({ data: rows.map(strip) });
  }

  if (method === 'GET' && path.startsWith('products/')) {
    const slug = path.split('/')[1];
    const row = await db.collection('products').findOne({ slug });
    if (!row) return json({ error: 'Not found' }, 404);
    return json({ data: strip(row) });
  }

  if (method === 'GET' && path === 'branches') {
    const rows = await db.collection('branches').find({}).toArray();
    return json({ data: rows.map(strip) });
  }

  if (method === 'GET' && path === 'testimonials') {
    const rows = await db.collection('testimonials').find({ active: true }).toArray();
    return json({ data: rows.map(strip) });
  }

  if (method === 'GET' && path === 'articles') {
    const rows = await db.collection('articles').find({ published: true }).sort({ publishedAt: -1 }).toArray();
    return json({ data: rows.map(strip) });
  }

  if (method === 'GET' && path.startsWith('articles/')) {
    const slug = path.split('/')[1];
    const row = await db.collection('articles').findOne({ slug });
    if (!row) return json({ error: 'Not found' }, 404);
    return json({ data: strip(row) });
  }

  if (method === 'GET' && path === 'faqs') {
    const rows = await db.collection('faqs').find({}).sort({ order: 1 }).toArray();
    return json({ data: rows.map(strip) });
  }

  // --- ADMIN AUTH ---
  if (method === 'POST' && path === 'admin/login') {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return json({ error: 'Email atau password salah' }, 401);
    }
    const token = uuid();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
    await db.collection('tokens').insertOne({ id: uuid(), token, email, expiresAt, createdAt: new Date().toISOString() });
    return json({ token, email, expiresAt });
  }

  if (method === 'POST' && path === 'admin/logout') {
    const user = await getAuthUser(req);
    if (!user) return json({ error: 'Unauthorized' }, 401);
    await db.collection('tokens').deleteOne({ token: user.token });
    return json({ ok: true });
  }

  if (method === 'GET' && path === 'admin/me') {
    const user = await getAuthUser(req);
    if (!user) return json({ error: 'Unauthorized' }, 401);
    return json({ email: user.email });
  }

  // --- ADMIN CRUD ---
  const adminMatch = path.match(/^admin\/(products|articles|branches|testimonials|faqs|categories)(?:\/(.+))?$/);
  if (adminMatch) {
    const user = await getAuthUser(req);
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const resource = adminMatch[1];
    const itemId = adminMatch[2];
    const col = db.collection(resource);

    if (method === 'GET' && !itemId) {
      const rows = await col.find({}).toArray();
      return json({ data: rows.map(strip) });
    }
    if (method === 'GET' && itemId) {
      const row = await col.findOne({ id: itemId });
      if (!row) return json({ error: 'Not found' }, 404);
      return json({ data: strip(row) });
    }
    if (method === 'POST' && !itemId) {
      const body = await req.json().catch(() => ({}));
      const doc = { id: uuid(), createdAt: new Date().toISOString(), ...body };
      if (resource === 'products' && doc.active === undefined) doc.active = true;
      if (resource === 'testimonials' && doc.active === undefined) doc.active = true;
      if (resource === 'articles') {
        if (doc.published === undefined) doc.published = true;
        doc.publishedAt = doc.publishedAt || new Date().toISOString();
        if (!doc.slug && doc.title) doc.slug = slugify(doc.title);
      }
      if (resource === 'products' && !doc.slug && doc.name) doc.slug = slugify(doc.name);
      await col.insertOne(doc);
      return json({ data: strip(doc) }, 201);
    }
    if ((method === 'PUT' || method === 'PATCH') && itemId) {
      const body = await req.json().catch(() => ({}));
      delete body._id; delete body.id;
      await col.updateOne({ id: itemId }, { $set: { ...body, updatedAt: new Date().toISOString() } });
      const row = await col.findOne({ id: itemId });
      return json({ data: strip(row) });
    }
    if (method === 'DELETE' && itemId) {
      await col.deleteOne({ id: itemId });
      return json({ ok: true });
    }
  }

  return json({ error: 'Route not found', path, method }, 404);
}

function slugify(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
