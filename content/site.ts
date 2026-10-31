import type { Localized } from "@/lib/i18n";

export const profile = {
  name: "Rangga Dewa Yudhistira",
  email: "ranggadewa853@gmail.com",
  github: "https://github.com/ranggadyexe",
  linkedin: "https://www.linkedin.com/in/rangga-yudhistira-3bbb16349/",
  location: {
    id: "Cibubur, Indonesia",
    en: "Cibubur, Indonesia",
  } satisfies Localized<string>,
  about: {
    id: [
      "Saya mengerjakan project dari ujung ke ujung — mulai dari model machine learning dan API, sampai cara aplikasinya dikemas, diuji, dan dirilis. Fokus saya sekarang adalah DevOps: membuat proses rilis yang bisa diulang dan aman.",
      "Di skripsi saya membangun deteksi anomali rute kapal dengan LSTM-Autoencoder dan LOF. Di Wade Convert saya merancang pipeline GitHub Actions, image Docker, pemindaian Trivy, dan publikasi ke GHCR. Dua-duanya mengajarkan hal yang sama: sistem yang baik harus bisa dijelaskan, diuji, dan dioperasikan.",
    ],
    en: [
      "I build projects end to end — from machine learning models and APIs to how the app is packaged, tested, and released. My current focus is DevOps: making releases repeatable and safe.",
      "For my thesis I built vessel-route anomaly detection with an LSTM-Autoencoder and LOF. In Wade Convert I designed the GitHub Actions pipeline, Docker images, Trivy scans, and GHCR publishing. Both taught me the same lesson: a good system must be explainable, testable, and operable.",
    ],
  } satisfies Localized<string[]>,
  focus: {
    id: [
      "Pipeline CI yang bisa diulang",
      "Container image yang lebih aman",
      "Deploy sederhana dan terobservasi",
    ],
    en: [
      "Repeatable CI pipelines",
      "Safer container images",
      "Simple, observable deploys",
    ],
  } satisfies Localized<string[]>,
};

export const skillGroups: {
  name: Localized<string>;
  items: string[];
}[] = [
  {
    name: { id: "Container & Infra", en: "Containers & Infra" },
    items: ["Docker", "Docker Compose", "Linux"],
  },
  {
    name: { id: "CI/CD & Keamanan", en: "CI/CD & Security" },
    items: ["GitHub Actions", "GHCR", "Trivy", "pre-commit"],
  },
  {
    name: { id: "Backend & Testing", en: "Backend & Testing" },
    items: ["Python", "FastAPI", "pytest", "REST API"],
  },
  {
    name: { id: "Frontend", en: "Frontend" },
    items: ["TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    name: { id: "Data & ML", en: "Data & ML" },
    items: ["TensorFlow", "scikit-learn", "pandas", "Streamlit"],
  },
];

export const journey: {
  kind: Localized<string>;
  title: Localized<string>;
  detail: Localized<string>;
}[] = [
  {
    kind: { id: "Proyek pribadi", en: "Personal project" },
    title: { id: "Wade Convert", en: "Wade Convert" },
    detail: {
      id: "Next.js + FastAPI, Docker Compose, CI/CD, Trivy, GHCR.",
      en: "Next.js + FastAPI, Docker Compose, CI/CD, Trivy, GHCR.",
    },
  },
  {
    kind: { id: "Skripsi", en: "Thesis" },
    title: {
      id: "Deteksi Anomali Rute Kapal",
      en: "Vessel Route Anomaly Detection",
    },
    detail: {
      id: "Hybrid LSTM-AE + LOF, adaptive threshold, dashboard Streamlit.",
      en: "Hybrid LSTM-AE + LOF, adaptive threshold, Streamlit dashboard.",
    },
  },
];
