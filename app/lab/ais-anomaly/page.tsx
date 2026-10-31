import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./ais.css";
import demoData from "@/public/data/ais-demo.json";
import { AisDemo } from "@/components/ais-demo";
import type { AisData } from "@/lib/ais";

const data = demoData as unknown as AisData;

export const metadata: Metadata = {
  title: "Demo Anomali AIS",
  description:
    "Jelajahi hasil deteksi anomali kapal Tanjung Priok dengan ambang skor adaptif, peta interaktif, dan detail per kapal.",
};

export default function AisAnomalyDemoPage() {
  return <AisDemo data={data} />;
}
