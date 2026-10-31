# PRD: Portfolio DevOps + Live Project Demos

Versi: 1.0 (draf) | Status: perlu ditinjau pemilik | Tanggal: 31 Oktober 2026

## 1. Executive Summary

**Problem Statement**
Rangga melamar posisi DevOps tetapi bukti kemampuannya tersebar di repo dan file lokal; recruiter tidak bisa melihat pipeline, arsitektur, dan hasil kerja dalam waktu singkat, dan project ML/konversi file tidak bisa dicoba langsung tanpa menjalankan kode.

**Proposed Solution**
Satu situs portofolio bilingual (ID/EN) yang menampilkan studi kasus terstruktur (arsitektur, pipeline CI/CD, keputusan teknis) serta dua demo interaktif berbasis browser: peta deteksi anomali kapal (data precompute dari skripsi) dan toolkit konversi file (4 tool inti). Situs dideploy di Vercel tanpa backend.

**Success Criteria**
- Situs production aktif di Vercel dengan build sukses < 5 menit dan preview otomatis untuk setiap PR.
- Lighthouse mobile: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 90.
- JavaScript awal halaman `/` <= 200 KB gzip; seluruh kode demo dimuat lazy.
- 4 tool konversi lulus matriks uji manual (Chrome, Edge, Firefox, Safari desktop + Chrome Android) untuk file <= 20 MB.
- Demo AIS siap dipakai < 2,5 detik pada 4G; perubahan threshold ter-render < 100 ms.
- 100% teks yang terlihat tersedia dalam ID dan EN tanpa campuran bahasa.

## 2. User Experience & Functionality

### User Personas

1. **Recruiter non-teknis** — memindai profil, CV, dan ringkasan project dalam < 2 menit; butuh kesan profesional dan navigasi jelas.
2. **Engineering Manager / DevOps Lead** — menilai kedalaman teknis: arsitektur, Docker, CI/CD, observability, alasan keputusan.
3. **Pengunjung umum / sesama developer** — ingin mencoba demo tanpa login, tanpa upload file, dan tanpa instalasi.
4. **Pemilik portofolio (Rangga)** — perlu memperbarui konten project tanpa menyentuh layout.

### User Stories & Acceptance Criteria

**US-01 — Recruiter memindai profil**
*As a recruiter, I want to understand who Rangga is and what role he targets within two minutes, so that I can decide whether to continue.*

- Hero menyebut posisi target (DevOps Engineer), lokasi, dan CTA "Unduh CV" + "Lihat Project" di atas fold.
- Halaman `/` memuat: ringkasan profil, skill utama, 2 kartu project, pengalaman, kontak.
- CV dapat diunduh sebagai PDF dari `public/cv.pdf` tanpa login.
- Semua link eksternal (GitHub, LinkedIn, email) dapat diklik dan benar.

**US-02 — Hiring manager menilai bukti DevOps**
*As a hiring manager, I want to see architecture, pipeline, and technical decisions per project, so that I can assess real capability.*

- Setiap project punya halaman `/projects/[slug]` dengan bagian: masalah, arsitektur (diagram), stack, pipeline CI/CD, keamanan, hasil/metrik, tautan repo + demo.
- Pipeline yang ditampilkan sesuai kondisi repo: lint, unit test, build image, Trivy, publikasi GHCR.
- Diagram arsitektur dapat dibaca di mobile (tidak terpotong).
- Klaim metrik (mis. DBI 1,42; 110 anomali) menyebut sumber datanya.

**US-03 — Pengunjung mencoba demo AIS**
*As a visitor, I want to explore the anomaly detection results interactively, so that I can understand the project without running Python.*

- Peta menampilkan kapal normal dan anomali dengan warna berbeda.
- Slider threshold mengubah klasifikasi dan KPI secara langsung; marker nilai knee (0,678) terlihat.
- Klik kapal menampilkan rute dan detail (MMSI, tipe, skor, confidence, jenis anomali).
- Data berasal dari `results/` skripsi dan dihasilkan oleh skrip ekspor yang tercatat versinya.
- Tidak ada request ke server untuk data per-kapal setelah JSON awal dimuat.

**US-04 — Pengunjung mencoba konversi file**
*As a visitor, I want to try the file tools in my browser, so that I can verify the product works without trusting an upload.*

- Tersedia 4 tool: kompres gambar, gambar ke PDF, gabung PDF, pisah PDF.
- File diproses di browser; tidak ada request jaringan yang membawa isi file (diverifikasi di DevTools Network).
- Batas file 20 MB ditampilkan; pelanggaran batas menghasilkan pesan error yang jelas.
- Hasil dapat diunduh dan file sementara dibersihkan saat halaman ditutup/di-refresh.
- Tool berat (OCR, PDF ke Markdown, kompres PDF server) tidak ditampilkan sebagai fitur live; disebut sebagai bagian repo.

**US-05 — Pengunjung mobile**
*As a mobile visitor, I want the site to be usable on a 360 px screen, so that I can browse during commute.*

- Tidak ada horizontal scroll pada 360 px.
- Target sentuh minimal 44x44 px.
- Navigasi utama dapat diakses tanpa hover.
- Peta tetap interaktif; tabel kapal menjadi alternatif data.

**US-06 — Pengunjung berganti bahasa**
*As a bilingual visitor, I want to switch ID/EN, so that I can read in my preferred language.*

- Toggle bahasa tersedia di navbar dan tersimpan di `localStorage`.
- Perubahan bahasa tidak memuat ulang halaman dan tidak menghilangkan state demo.
- Tidak ada string UI yang belum diterjemahkan; atribut `lang` dokumen ikut berubah.

**US-07 — Pemilik memperbarui konten**
*As the owner, I want to edit project content in one place, so that updates do not require layout work.*

- Konten project dan profil berada di `content/*.ts` dengan tipe TypeScript.
- Menambah project baru hanya butuh entri data + halaman detail otomatis.
- `npm run build` gagal jika data wajib tidak lengkap (tipe/validasi).

### Non-Goals

- CMS, dashboard admin, komentar, blog, analytics pihak ketiga.
- Autentikasi, database, backend/serverless function.
- Inference ML live di browser atau server.
- Hosting tool berat (OCR, Ghostscript, PDF ke Markdown) sebagai layanan publik.
- i18n berbasis URL (`/en`, `/id`) dan SEO multibahasa penuh.
- Versi mobile native.
- Custom domain (dapat ditambahkan setelah v1.0).

## 3. AI System Requirements

Tidak berlaku untuk situs portofolio. Demo AIS tidak menjalankan model; ia memvisualisasikan hasil inferensi yang sudah dihitung di skripsi.

**Persyaratan data demo (pengganti evaluasi AI):**
- Data diekspor dari `C:\revisiSempro\results\` oleh `scripts/export_demo.py` yang di-commit.
- Skema JSON divalidasi saat build; jumlah kapal, rentang skor, dan nilai metrik dicek terhadap `adaptive_threshold_metrics.json`.
- Nilai yang ditampilkan di UI harus identik dengan sumber: bobot LSTM 0,674 / LOF 0,326, DBI knee 1,4249, 110 anomali (0,104%).
- Ukuran `ais-demo.json` <= 2 MB; rute di-decimate maksimal 80 titik per kapal.

## 4. Technical Specifications

### Architecture Overview

```text
GitHub (portfolio) ──> Vercel Build ──> Static/ISR Next.js
                                          ├─ /                 (profil)
                                          ├─ /projects/[slug]  (studi kasus)
                                          ├─ /lab/ais-anomaly  (client island + ais-demo.json)
                                          └─ /lab/wade-convert (client island, pdf-lib/pdf.js)

C:\revisiSempro ──export_demo.py──> public/data/ais-demo.json
C:\wade-convert  ──(repo terpisah)──> Docker + CI + GHCR + Vercel web (browser tools)
```

### Stack
- **Framework:** Next.js 16 App Router, React 19, TypeScript.
- **Styling:** Tailwind CSS v4, shadcn/ui, Lucide, tema "Quiet Engineer".
- **Font:** Geist Sans + Geist Mono.
- **Peta:** Leaflet + tile CARTO/OSM (tanpa API key).
- **File tools:** `pdf-lib`, `pdfjs-dist`; dipanggil via dynamic import hanya di route demo.
- **Chart:** SVG manual (tanpa library chart).

### Design System (Quiet Engineer)
- Light: bg `#FAFAF9`, surface `#FFFFFF`, text `#18181B`, muted `#71717A`, border `#E4E4E7`, accent `#0F766E`, accent-soft `#CCFBF1`.
- Dark: bg `#0A0A0B`, surface `#111113`, text `#FAFAFA`, muted `#A1A1AA`, border `#27272A`, accent `#14B8A6`.
- Radius 12 px; satu aksen; tanpa gradient dekoratif.
- Glass hanya pada navbar (`backdrop-blur-md`, opacity 70%) dan overlay kecil; panel data/peta selalu solid.
- Kontras minimum WCAG AA; focus ring terlihat; hormati `prefers-reduced-motion`.

### Functional Requirements
| ID | Requirement |
|---|---|
| FR-01 | Halaman `/` menampilkan hero, tentang, skill, project, pengalaman, kontak. |
| FR-02 | Halaman detail project dihasilkan dari data bertipe di `content/projects.ts`. |
| FR-03 | Demo AIS: peta, slider threshold, KPI, distribusi jenis, tabel, detail rute. |
| FR-04 | Demo Wade: 4 tool browser dengan drag-and-drop, progres, unduh. |
| FR-05 | Toggle bahasa ID/EN dan tema terang/gelap, tersimpan di `localStorage`. |
| FR-06 | CV dapat diunduh; tautan GitHub/LinkedIn/email tersedia. |
| FR-07 | Halaman 404 kustom dan metadata Open Graph per halaman. |
| FR-08 | `sitemap.xml` dan `robots.txt` dihasilkan otomatis. |

### Non-Functional Requirements
| ID | Requirement |
|---|---|
| NFR-01 | Lighthouse mobile: Perf >= 90, A11y >= 95, BP >= 95, SEO >= 90. |
| NFR-02 | JS awal `/` <= 200 KB gzip; lib demo hanya di route demo. |
| NFR-03 | Demo AIS interaktif < 2,5 s pada 4G; update slider < 100 ms. |
| NFR-04 | Tidak ada horizontal scroll pada lebar 360 px. |
| NFR-05 | Build production sukses < 5 menit di Vercel. |
| NFR-06 | Tidak ada error console pada semua route (production). |
| NFR-07 | Semua teks terlihat tersedia dalam ID dan EN. |

### Integration Points
- **Vercel:** build dari GitHub, preview per PR, production dari `main`.
- **GitHub Actions (portfolio):** lint + typecheck + build pada PR (bukti praktik CI).
- **Repo `wade-convert`:** tautan repo, badge CI, dan deployment web terpisah.
- **Tidak ada:** database, auth, API backend, payment, analytics.

### Security & Privacy
- Demo konversi tidak mengunggah file; verifikasi via DevTools Network dan tidak ada endpoint API.
- Tidak ada secret di client; tidak ada `.env` yang di-commit.
- Hanya `localStorage` untuk bahasa/tema; tanpa cookie tracking.
- Header keamanan dasar di Vercel: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; CSP bila tidak mengganggu tile peta.
- Data skripsi yang diekspor tidak memuat informasi pribadi; hanya MMSI publik dan koordinat.
- Lisensi: kode `wade-convert` milik pemilik (AGPL-3.0); portofolio hanya memakai potongan library kecil milik sendiri, bukan menyalin aplikasi.

## 5. Risks & Roadmap

### Phased Rollout
**MVP (v1.0)**
1. Scaffold repo, design tokens, navbar, i18n, dark mode.
2. Halaman profil + 2 studi kasus.
3. Skrip ekspor data + demo AIS.
4. Demo Wade 4 tool.
5. Rapikan repo `wade-convert` ke scope v1.
6. Deploy Vercel + verifikasi NFR.

**v1.1**
- Badge CI, screenshot/OG image per project, halaman "How this site is deployed".
- Custom domain + HTTPS.
- Audit Lighthouse dan perbaikan performa.

**v2.0 (opsional)**
- Tautan ke dashboard Streamlit/HF Spaces.
- Project tambahan dan studi kasus pipeline lanjutan.
- Analytics ringan tanpa cookie (jika dibutuhkan).

### Technical Risks
| Risiko | Dampak | Mitigasi |
|---|---|---|
| `backdrop-blur` berat di HP kelas bawah | Jank, skor performa turun | Batasi glass pada navbar; uji di perangkat nyata; fallback tanpa blur. |
| `ais-demo.json` membengkak | Load lambat, kuota seluler | Decimate rute, batasi jumlah kapal, target <= 2 MB, ukur di CI. |
| Tile peta diblokir/rate limit | Peta kosong | Fallback ke scatter SVG/canvas + tabel; konfigurasi tile via env. |
| Data demo tidak sinkron dengan skripsi | Klaim salah | Skrip ekspor + validasi skema dan nilai acuan saat build. |
| Duplikasi logika `wade-convert` | Perbaikan ganda | Hanya 4 lib kecil; jangan fork aplikasi; dokumentasikan sumber. |
| Konten bilingual tidak konsisten | Kualitas menurun | Dictionary bertipe + checklist terjemahan di PR. |
| Repo `wade-convert` dipangkas menghilangkan bukti kerja | Kehilangan histori | Hapus dari `main` tetapi tetap ada di git history; tag `v0.9`. |

### Assumptions & Open Questions
- Deadline peluncuran: **TBD** (asumsi: sebelum mulai melamar aktif).
- CV PDF final dan URL LinkedIn: **TBD** (menunggu aset dari pemilik).
- Nama domain: **TBD**; v1.0 memakai domain `*.vercel.app`.
- Nama repo portofolio: asumsi `portfolio` di akun `ranggadyexe`.
- Perlu screenshot asli dashboard Streamlit untuk studi kasus: **TBD**.
