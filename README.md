# Portofolio Rangga Dewa Yudhistira

Portofolio bilingual ID/EN untuk posisi DevOps Engineer: studi kasus, keputusan teknis, dan dua demo yang bisa dicoba langsung di browser.

## Demo

- `/lab/ais-anomaly` — peta anomali kapal dari hasil skripsi, memakai data precompute.
- `/lab/wade-convert` — kompres gambar, gambar ke PDF, gabung PDF, dan pisah PDF; semua diproses di browser tanpa upload.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Leaflet, pdf-lib.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Pemeriksaan:

```bash
npm run lint
npm run build
```

## Struktur

```text
app/          # route halaman dan demo
components/   # UI, peta, dan demo interaktif
content/      # profil dan studi kasus
lib/          # i18n, tipe data, helper
public/data/  # data precompute demo AIS
docs/         # PRD dan catatan produk
```

## Deployment

Ditujukan untuk Vercel sebagai situs statis. Tidak ada backend, database, atau environment variable yang dibutuhkan untuk demo.
