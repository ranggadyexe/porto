import type { Localized } from "@/lib/i18n";

export type ProjectOutcome = {
  value: string;
  label: Localized<string>;
};

export type Project = {
  slug: string;
  name: string;
  category: Localized<string>;
  period: string;
  tagline: Localized<string>;
  summary: Localized<string>;
  role: Localized<string>;
  stack: string[];
  repo?: string;
  demo?: string;
  demoNote?: Localized<string>;
  outcomes: ProjectOutcome[];
  problem: Localized<string>;
  approach: Localized<string>;
  architecture: Localized<string[]>;
  pipeline: Localized<string[]>;
  security: Localized<string[]>;
};

export const projects: Project[] = [
  {
    slug: "wade-convert",
    name: "Wade Convert",
    category: { id: "DevOps · Fullstack", en: "DevOps · Fullstack" },
    period: "2026",
    tagline: {
      id: "Konversi file yang privasi-first, dengan pipeline rilis end-to-end.",
      en: "Privacy-first file conversion with an end-to-end release pipeline.",
    },
    summary: {
      id: "Empat tool konversi inti berbasis Next.js yang berjalan di browser, ditambah API FastAPI dan pipeline container sebagai showcase DevOps.",
      en: "Four core browser-based conversion tools built with Next.js, plus a FastAPI service and container pipeline as a DevOps showcase.",
    },
    role: {
      id: "Solo — arsitektur, backend, frontend, CI/CD",
      en: "Solo — architecture, backend, frontend, CI/CD",
    },
    stack: [
      "Next.js",
      "FastAPI",
      "Docker",
      "GitHub Actions",
      "GHCR",
      "Trivy",
    ],
    repo: "https://github.com/ranggadyexe/wade-convert",
    demo: "/lab/wade-convert",
    demoNote: {
      id: "Kompres gambar, gambar ke PDF, gabung, dan pisah PDF — semuanya diproses di browser.",
      en: "Compress images, images to PDF, merge and split PDFs — all processed in the browser.",
    },
    outcomes: [
      {
        value: "4",
        label: { id: "tool inti di demo", en: "core tools in the demo" },
      },
      {
        value: "2",
        label: { id: "image GHCR", en: "GHCR images" },
      },
      {
        value: "0",
        label: {
          id: "upload untuk tool browser",
          en: "uploads for browser tools",
        },
      },
    ],
    problem: {
      id: "Layanan konversi populer membatasi penggunaan, menampilkan iklan, dan memaksa pengguna mengunggah dokumen sensitif ke server pihak lain.",
      en: "Popular conversion services limit usage, show ads, and force users to upload sensitive documents to someone else's server.",
    },
    approach: {
      id: "Memproses empat tool inti sepenuhnya di browser dengan pdf-lib dan canvas; menyediakan API FastAPI terpisah untuk tool berat; membungkus semuanya dalam Docker Compose.",
      en: "Run four core tools entirely in the browser with pdf-lib and canvas; provide a separate FastAPI service for heavy tools; wrap everything in Docker Compose.",
    },
    architecture: {
      id: [
        "Aplikasi Next.js menyajikan empat tool inti; file tidak pernah diunggah.",
        "API FastAPI tersedia untuk tool berat (OCR dan PDF ke Markdown) dengan validasi, rate limit, dan TTL.",
        "Dua image Docker (web dan api) dijalankan lewat Docker Compose; image dipublikasikan ke GHCR.",
      ],
      en: [
        "The Next.js web app serves four core tools; files are never uploaded.",
        "The FastAPI service supports heavy tools (OCR and PDF to Markdown) with validation, rate limits, and TTL.",
        "Two Docker images (web and api) run through Docker Compose; images are published to GHCR.",
      ],
    },
    pipeline: {
      id: [
        "API: ruff dan pytest. Web: eslint, unit test, dan next build.",
        "Build image dengan cache, lalu push ke GHCR saat push ke main.",
        "Trivy memindai image; build gagal jika ada HIGH/CRITICAL yang sudah tersedia perbaikannya.",
      ],
      en: [
        "API: ruff and pytest. Web: eslint, unit tests, and next build.",
        "Cached image builds pushed to GHCR on every push to main.",
        "Trivy scans images; the build fails on fixable HIGH/CRITICAL findings.",
      ],
    },
    security: {
      id: [
        "Container API dan web berjalan sebagai non-root; image dipindai Trivy dan build gagal untuk HIGH/CRITICAL yang bisa diperbaiki.",
        "API membatasi ukuran upload, rate per IP, dan menghapus file sementara lewat TTL.",
        "Demo portofolio hanya memakai tool browser; file tidak dikirim ke server.",
      ],
      en: [
        "API and web containers run as non-root; images are scanned with Trivy and the build fails on fixable HIGH/CRITICAL findings.",
        "The API enforces upload size limits, per-IP rate limits, and deletes temporary files via TTL.",
        "The portfolio demo only uses browser tools; files are never sent to a server.",
      ],
    },
  },
  {
    slug: "ais-anomaly",
    name: "AIS Anomaly",
    category: { id: "Machine Learning · Skripsi", en: "Machine Learning · Thesis" },
    period: "Skripsi",
    tagline: {
      id: "Deteksi anomali rute kapal dengan ensemble LSTM-AE + LOF dan threshold adaptif.",
      en: "Vessel route anomaly detection with an LSTM-AE + LOF ensemble and adaptive thresholding.",
    },
    summary: {
      id: "Mengolah 105.813 rekaman AIS mentah Tanjung Priok; 105.388 di antaranya lolos cleaning dan dipakai model, tanpa aturan potong Top 10%.",
      en: "Processes 105,813 raw Tanjung Priok AIS records; 105,388 pass cleaning and feed the model, without a forced Top 10% cut.",
    },
    role: {
      id: "Solo — riset, pipeline data, model, dashboard",
      en: "Solo — research, data pipeline, model, dashboard",
    },
    stack: [
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "pandas",
      "Streamlit",
    ],
    demo: "/lab/ais-anomaly",
    demoNote: {
      id: "Jelajahi peta, geser threshold, dan lihat posisi kapal yang terdeteksi anomali.",
      en: "Explore the map, move the threshold, and inspect detected anomalous vessel positions.",
    },
    outcomes: [
      {
        value: "105.388",
        label: { id: "rekaman bersih", en: "clean records" },
      },
      { value: "669", label: { id: "kapal", en: "vessels" } },
      {
        value: "1,42",
        label: { id: "DBI pada knee", en: "DBI at the knee" },
      },
      {
        value: "110",
        label: { id: "anomali (0,104%)", en: "anomalies (0.104%)" },
      },
    ],
    problem: {
      id: "Deteksi anomali tradisional memakai potong paksa Top 10%, sehingga ambang tidak mengikuti distribusi data dan sulit dipertanggungjawabkan.",
      en: "Traditional anomaly detection forces a Top 10% cut, so the threshold ignores the data distribution and is hard to justify.",
    },
    approach: {
      id: "Menggabungkan skor temporal LSTM-Autoencoder dan spasial LOF dengan bobot inverse DBI, lalu menentukan threshold lewat Mean+kσ dan Knee Detection.",
      en: "Combine temporal LSTM-Autoencoder scores and spatial LOF scores with inverse-DBI weights, then pick the threshold via Mean+kσ and knee detection.",
    },
    architecture: {
      id: [
        "Preprocessing dan feature engineering dari data AIS menjadi 46 fitur.",
        "LSTM-AE dan LOF menghasilkan skor anomali; bobot 0,674 dan 0,326 dihitung dari DBI.",
        "Adaptive threshold memilih knee curve (0,678) dan menghasilkan 110 anomali (0,104%).",
        "Dashboard Streamlit menampilkan rute normal vs anomali di atas peta.",
      ],
      en: [
        "Preprocessing and feature engineering turn the AIS data into 46 features.",
        "LSTM-AE and LOF produce anomaly scores; weights of 0.674 and 0.326 are derived from DBI.",
        "Adaptive thresholding picks the knee point (0.678) and yields 110 anomalies (0.104%).",
        "A Streamlit dashboard shows normal versus anomalous routes on a map.",
      ],
    },
    pipeline: {
      id: [
        "Notebook 01–08: preprocessing, fitur, baseline, model, evaluasi, visualisasi, threshold.",
        "Model tersimpan (.keras/.pkl) dan hasil diekspor ke CSV/JSON.",
        "Demo portofolio memakai data precompute; model tidak dijalankan di browser.",
      ],
      en: [
        "Notebooks 01–08: preprocessing, features, baselines, model, evaluation, visualization, threshold.",
        "Models are persisted (.keras/.pkl) and results exported to CSV/JSON.",
        "The portfolio demo uses precomputed data; the model does not run in the browser.",
      ],
    },
    security: {
      id: [
        "Data yang diekspor hanya MMSI publik dan koordinat; tidak ada informasi pribadi.",
        "Demo memakai JSON precompute, bukan menjalankan model atau menerima upload.",
        "Skor, bobot, dan ambang di UI diverifikasi terhadap hasil skripsi.",
      ],
      en: [
        "Exported data contains only public MMSI identifiers and coordinates; no personal information.",
        "The demo uses precomputed JSON instead of running the model or accepting uploads.",
        "Scores, weights, and thresholds in the UI are checked against the thesis results.",
      ],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
