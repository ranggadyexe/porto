import type { Metadata } from "next";
import { JourneyPageContent } from "@/components/journey-page";

export const metadata: Metadata = {
  title: "My Journey",
  description:
    "Pendidikan, riset, magang, sertifikasi, dan pencapaian Rangga Dewa Yudhistira.",
};

export default function JourneyPage() {
  return <JourneyPageContent />;
}
