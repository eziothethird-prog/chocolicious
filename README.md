# Chocolicious — Premium Cookies & Cake

Website resmi Chocolicious (PT. Berkah Bersama Gemilang) — toko Premium Cookies & Cake di Makassar.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes (REST)
- **Database:** MongoDB
- **Storage:** Emergent Object Storage (optional, platform-only) / URL fallback
- **Editor:** TipTap (rich text untuk artikel)

> Kontrak REST API mengikuti PRD Laravel — mudah di-port ke Laravel + MySQL nanti.

---

## 🚀 Menjalankan di Lokal

### 1. Prasyarat

- **Node.js** 18+ (rekomendasi 20 LTS)
- **Yarn** (jangan pakai npm — akan merusak `yarn.lock`)
- **MongoDB** berjalan di `localhost:27017`

**Cara install MongoDB:**

- **Pakai Docker (termudah):**
  ```bash
  docker run -d --name mongo -p 27017:27017 mongo:7
  ```
- **Atau install MongoDB Community Edition** dari https://www.mongodb.com/try/download/community
- **Atau pakai MongoDB Atlas gratis** — copy connection string ke `MONGO_URL` di `.env`

### 2. Setup Project

```bash
# Clone repository
git clone <your-repo-url>
cd chocolicious

# Copy template environment
cp .env.example .env
# Edit .env dan sesuaikan MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD

# Install dependencies
yarn install

# Jalankan dev server
yarn dev
```

Buka `http://localhost:3000` di browser.

Database akan **auto-seed** saat API pertama kali dipanggil (kategori, produk, cabang, testimoni, artikel, FAQ).

### 3. Login Admin

Buka `http://localhost:3000/admin`

Pakai kredensial yang Anda set di `.env`:
- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

---

## 📋 Halaman yang Tersedia

### Publik
- `/` — Beranda
- `/produk` — Katalog dengan filter kategori
- `/produk/[slug]` — Detail produk + kolom ulasan
- `/tentang` — Tentang Chocolicious
- `/cabang` — 7 outlet dengan Google Maps embed
- `/artikel` — Blog / artikel SEO
- `/artikel/[slug]` — Detail artikel
- `/faq` — Pertanyaan umum
- `/kontak` — Kontak & alamat

### Admin (butuh login)
- `/admin` — Login
- `/admin/dashboard` — CRUD Produk, Artikel, Cabang, Testimoni, Ulasan, Newsletter

### SEO
- `/sitemap.xml` — Sitemap dinamis
- `/robots.txt` — Robots rules

---

## 🔌 REST API Endpoints

### Public
- `GET /api/health`
- `GET /api/categories`
- `GET /api/products` — params: `?category=<slug>&featured=true`
- `GET /api/products/:slug`
- `GET /api/products/:slug/reviews`
- `POST /api/products/:slug/reviews` — body: `{name, comment, rating}`
- `GET /api/branches`
- `GET /api/testimonials`
- `GET /api/articles`
- `GET /api/articles/:slug`
- `GET /api/faqs`
- `POST /api/newsletter/subscribe` — body: `{email}`

### Admin (Bearer token)
- `POST /api/admin/login` — body: `{email, password}` → `{token}`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `POST /api/admin/upload` — multipart: `file`
- `GET|POST|PUT|DELETE /api/admin/{products|articles|branches|testimonials|faqs|reviews|newsletter}[/:id]`

### Files
- `GET /api/files/:path` — serve uploaded images (public)

---

## 🛠️ Fitur Utama

- ✅ Desain premium (coklat/cream/gold, Playfair Display + Inter)
- ✅ Mobile-first responsive
- ✅ Admin panel dengan 6 resource CRUD
- ✅ Upload gambar langsung (Object Storage) + fallback URL
- ✅ Rich text editor TipTap untuk artikel
- ✅ Review produk + moderasi admin
- ✅ Newsletter subscribe
- ✅ Integrasi WhatsApp order
- ✅ SEO on-page + sitemap otomatis
- ✅ Google Maps embed per cabang
- ✅ Security headers (X-Frame-Options, CSP, dll)

---

## 📂 Struktur Folder

```
app/
├── api/[[...path]]/route.js   # REST API (semua endpoint)
├── api/files/[...path]/       # File server (image proxy)
├── admin/                     # Login + Dashboard
├── produk/                    # Katalog + detail
├── artikel/                   # Blog + detail
├── tentang|cabang|faq|kontak/ # Halaman statis
├── sitemap.xml/ robots.txt/   # SEO routes
├── layout.js, page.js, globals.css
components/
├── site/                      # Navbar, Footer, ReviewSection, NewsletterForm, ...
├── admin/                     # ImageUploader, RichTextEditor
└── ui/                        # shadcn components
lib/
├── mongo.js                   # Koneksi DB
├── storage.js                 # Emergent Object Storage client
├── seed.js                    # Data awal (auto-seed)
└── client.js                  # Fetch helper & utils
```

---

## 🚢 Deploy

### Frontend + API (Next.js)
- **Vercel** (gratis, 1-click deploy dari GitHub)
- **Hostinger** (Node.js hosting)
- **VPS** sendiri

### Database
- **MongoDB Atlas** (free tier 512 MB) — paling mudah
- MongoDB self-hosted di VPS

Set environment variables di dashboard deploy (jangan commit `.env`).

---

## ⚠️ Troubleshooting

**Login admin tidak bisa:**
- Pastikan file `.env` sudah ada (copy dari `.env.example`)
- Cek `ADMIN_EMAIL` & `ADMIN_PASSWORD` sudah terisi

**Data produk/cabang kosong:**
- Cek MongoDB sudah jalan: `mongosh` atau `docker ps`
- Cek `MONGO_URL` di `.env` sesuai dengan MongoDB lokal Anda
- Request pertama akan auto-seed

**Upload gambar gagal:**
- Normal saat run lokal. `EMERGENT_LLM_KEY` hanya aktif di platform Emergent
- Gunakan input URL manual sebagai alternatif, atau migrasikan ke Supabase Storage / Cloudinary

---

## 📝 Lisensi

Property dari PT. Berkah Bersama Gemilang.
Dikembangkan oleh Ahmad Thahir.
