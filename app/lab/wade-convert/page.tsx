import type { Metadata } from "next";
import { WadeDemo } from "@/components/wade-demo";

export const metadata: Metadata = {
  title: "Demo Wade Convert",
  description:
    "Empat alat konversi file yang berjalan sepenuhnya di browser: kompres gambar, gambar ke PDF, gabung PDF, dan pisah PDF.",
};

export default function WadeConvertDemoPage() {
  return <WadeDemo />;
}
