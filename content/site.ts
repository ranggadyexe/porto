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
      "Halo, saya Rangga Dewa Yudhistira, lulusan Informatika Universitas Nasional dengan IPK 3,85 dan minat besar pada DevOps serta infrastruktur perangkat lunak. Saya memiliki pengalaman menjelajahi Linux, Git, GitHub, dan CI/CD, serta magang di BPKP Pusat.",
      "Perjalanan saya menggabungkan riset machine learning dan praktik DevOps. Melalui skripsi, saya mengeksplorasi deteksi anomali rute kapal menggunakan machine learning. Di project Wade Convert, saya mengerjakan otomasi CI/CD, pemindaian keamanan image Docker dengan Trivy, dan publikasi image container melalui GitHub Container Registry (GHCR).",
      "Saya terus belajar membangun, menguji, mengamankan, dan merilis aplikasi melalui alur yang bisa diulang dan andal.",
      "Saya menghargai pembelajaran berkelanjutan, pemecahan masalah, dan kolaborasi, serta menantikan kesempatan berkembang sebagai DevOps Engineer.",
    ],
    en: [
      "Hello, I'm Rangga Dewa Yudhistira, an Informatics graduate from Universitas Nasional with a 3.85 GPA and a strong interest in DevOps and software infrastructure. I have experience exploring Linux, Git, GitHub, and CI/CD, along with an internship at BPKP Pusat.",
      "My journey combines machine learning research and hands-on DevOps practices. Through my thesis, I explored vessel-route anomaly detection using machine learning. In my Wade Convert project, I worked on CI/CD automation, Docker image security scanning with Trivy, and container image publishing through GitHub Container Registry (GHCR).",
      "I'm continuously learning how to build, test, secure, and deploy applications through repeatable and reliable workflows.",
      "I value continuous learning, problem-solving, and collaboration, and I'm looking forward to growing as a DevOps Engineer.",
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
    name: { id: "Sistem & Container", en: "Systems & Containers" },
    items: ["Linux", "Docker", "Docker Compose"],
  },
  {
    name: { id: "Version Control & CI/CD", en: "Version Control & CI/CD" },
    items: ["Git", "GitHub", "GitHub Actions"],
  },
  {
    name: { id: "Aplikasi", en: "Application" },
    items: ["Python", "FastAPI", "Next.js"],
  },
  {
    name: { id: "Riset (Skripsi)", en: "Research (Thesis)" },
    items: ["TensorFlow", "scikit-learn", "pandas", "Streamlit"],
  },
];

export const journey: {
  kind: Localized<string>;
  title: Localized<string>;
  role: Localized<string>;
  detail: Localized<string>;
}[] = [
  {
    kind: { id: "Proyek pribadi", en: "Personal project" },
    title: { id: "Wade Convert", en: "Wade Convert" },
    role: {
      id: "Solo — aplikasi, Docker, CI/CD",
      en: "Solo — application, Docker, CI/CD",
    },
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
    role: {
      id: "Solo — riset, pipeline data, model, dashboard",
      en: "Solo — research, data pipeline, model, dashboard",
    },
    detail: {
      id: "Hybrid LSTM-AE + LOF, adaptive threshold, dashboard Streamlit.",
      en: "Hybrid LSTM-AE + LOF, adaptive threshold, Streamlit dashboard.",
    },
  },
];
