import type { Localized } from "@/lib/i18n";

export type Ship = {
  mmsi: number;
  lat: number;
  lon: number;
  score: number;
  mean: number;
  points: number;
  shiptype: number | null;
  type: string;
  confidence: string;
  anom: number;
  route: [number, number][];
};

export type Preset = {
  name: string;
  threshold: number;
  dbi: number;
  records: number;
  rate: number;
  ships: number;
};

export type AisData = {
  meta: {
    schemaVersion: number;
    generatedBy: string;
    source: string;
    records: number;
    vessels: number;
    rawRecords: number;
    rawVessels: number;
    scoreMin: number;
    scoreMax: number;
    knee: number;
    kneeShips: number;
    kneeTypes: Record<string, number>;
    tailMin: number;
    maxRoutePoints: number;
    weights: { lstm: number; lof: number };
    dbiPerModel: { lstm: number; lof: number };
  };
  presets: Preset[];
  scoreTail: number[];
  ships: Ship[];
};

export const TYPE_LABELS: Record<string, Localized<string>> = {
  "Spatial Deviation": { id: "Deviasi spasial", en: "Spatial deviation" },
  "Erratic Path": { id: "Jalur tidak stabil", en: "Erratic path" },
  "Unstable Speed": { id: "Kecepatan tidak stabil", en: "Unstable speed" },
  "Temporal Anomaly": { id: "Anomali temporal", en: "Temporal anomaly" },
  Loitering: { id: "Loitering", en: "Loitering" },
  "Complex Pattern": { id: "Pola kompleks", en: "Complex pattern" },
  NORMAL: { id: "Normal", en: "Normal" },
};

export const TYPE_COLORS: Record<string, string> = {
  "Spatial Deviation": "var(--chart-3)",
  "Erratic Path": "var(--chart-2)",
  "Unstable Speed": "var(--chart-1)",
  "Temporal Anomaly": "var(--chart-4)",
  Loitering: "var(--chart-5)",
  "Complex Pattern": "var(--chart-4)",
};

export const PRESET_LABELS: Record<string, Localized<string>> = {
  "Baseline (Top 10%)": {
    id: "Baseline (10% teratas)",
    en: "Baseline (top 10%)",
  },
  "Mean + 1.5\u03c3": { id: "Mean + 1,5\u03c3", en: "Mean + 1.5\u03c3" },
  "Mean + 2.0\u03c3": { id: "Mean + 2,0\u03c3", en: "Mean + 2.0\u03c3" },
  "Mean + 2.5\u03c3": { id: "Mean + 2,5\u03c3", en: "Mean + 2.5\u03c3" },
  "Knee/Elbow": { id: "Knee / Elbow", en: "Knee / elbow" },
};

export function countAbove(sortedScores: number[], threshold: number) {
  let low = 0;
  let high = sortedScores.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (sortedScores[mid] < threshold) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return sortedScores.length - low;
}
