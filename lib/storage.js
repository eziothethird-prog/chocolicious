// Emergent Object Storage client for Next.js
const STORAGE_URL = 'https://integrations.emergentagent.com/objstore/api/v1/storage';
const APP_NAME = process.env.APP_NAME || 'chocolicious';

let storageKey = null;
let initPromise = null;

async function init() {
  if (storageKey) return storageKey;
  if (initPromise) return initPromise;
  const emergentKey = process.env.EMERGENT_LLM_KEY;
  if (!emergentKey) throw new Error('EMERGENT_LLM_KEY not set');
  initPromise = (async () => {
    const r = await fetch(`${STORAGE_URL}/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emergent_key: emergentKey }),
    });
    if (!r.ok) throw new Error(`storage init failed: ${r.status} ${await r.text()}`);
    const j = await r.json();
    storageKey = j.storage_key;
    return storageKey;
  })();
  try { return await initPromise; } finally { initPromise = null; }
}

export async function putObject(path, bytes, contentType) {
  const key = await init();
  const r = await fetch(`${STORAGE_URL}/objects/${path}`, {
    method: 'PUT',
    headers: { 'X-Storage-Key': key, 'Content-Type': contentType || 'application/octet-stream' },
    body: bytes,
  });
  if (!r.ok) throw new Error(`upload failed: ${r.status} ${await r.text()}`);
  return r.json();
}

export async function getObject(path) {
  const key = await init();
  const r = await fetch(`${STORAGE_URL}/objects/${path}`, {
    headers: { 'X-Storage-Key': key },
  });
  if (!r.ok) throw new Error(`download failed: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  return { data: buf, contentType: r.headers.get('content-type') || 'application/octet-stream' };
}

export function buildPath(ext) {
  const id = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
  return `${APP_NAME}/uploads/${id}.${ext || 'bin'}`;
}

export const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
