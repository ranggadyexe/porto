import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { CvPageContent } from "@/components/cv-page";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Lihat dan unduh CV Rangga Dewa Yudhistira, DevOps Engineer.",
};

export default function CvPage() {
  const hasCv = existsSync(join(process.cwd(), "public", "cv.pdf"));

  return <CvPageContent hasCv={hasCv} />;
}
