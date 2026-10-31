import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Portofolio Rangga Dewa Yudhistira, DevOps Engineer. Studi kasus Docker, CI/CD, keamanan supply chain, dan demo interaktif di browser.";

export const metadata: Metadata = {
  title: {
    default: "Rangga Dewa Yudhistira — DevOps Engineer",
    template: "%s — Rangga Dewa Yudhistira",
  },
  description,
  applicationName: "Portofolio Rangga Dewa Yudhistira",
  authors: [
    { name: "Rangga Dewa Yudhistira", url: "https://github.com/ranggadyexe" },
  ],
  creator: "Rangga Dewa Yudhistira",
  keywords: [
    "DevOps Engineer",
    "Docker",
    "CI/CD",
    "GitHub Actions",
    "Kubernetes",
    "Portofolio",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Rangga Dewa Yudhistira",
    title: "Rangga Dewa Yudhistira — DevOps Engineer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Rangga Dewa Yudhistira — DevOps Engineer",
    description,
  },
};

const themeScript = `(function(){try{var s=localStorage.getItem("theme");var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

// ponytail: static year keeps the prerender stable; bump it each January.
const YEAR = 2026;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <I18nProvider>
          <a
            href="#content"
            className="sr-only rounded-md focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
          >
            Lewati ke konten / Skip to content
          </a>
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter year={YEAR} />
        </I18nProvider>
      </body>
    </html>
  );
}
