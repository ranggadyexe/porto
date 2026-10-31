import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact-page";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Kirim pesan ke Rangga Dewa Yudhistira untuk peluang DevOps, kolaborasi, atau diskusi teknis.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
