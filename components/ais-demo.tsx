"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft } from "lucide-react";
import { AisMap } from "@/components/ais-map";
import { useI18n } from "@/components/i18n-provider";
import {
  countAbove,
  PRESET_LABELS,
  TYPE_COLORS,
  TYPE_LABELS,
  type AisData,
  type Ship,
} from "@/lib/ais";

const MAX_THRESHOLD = 0.85;

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <p className="text-xs leading-4 text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

export function AisDemo({ data }: { data: AisData }) {
  const { t, lang } = useI18n();
  const [threshold, setThreshold] = useState(data.meta.knee);
  const [selected, setSelected] = useState<Ship | null>(null);

  const locale = lang === "id" ? "id-ID" : "en-US";
  const integer = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const score = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
    [locale],
  );
  const dbi = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 4,
      }),
    [locale],
  );

  const activePreset =
    data.presets.find(
      (preset) => Math.abs(preset.threshold - threshold) < 0.0005,
    ) ?? null;
  const effectiveThreshold = activePreset?.threshold ?? threshold;

  const flagged = data.ships
    .filter((ship) => ship.score >= effectiveThreshold)
    .sort((a, b) => b.score - a.score);

  const records = countAbove(data.scoreTail, effectiveThreshold);
  const rate = (records / data.meta.records) * 100;
  const kneeTotal = Object.values(data.meta.kneeTypes).reduce(
    (sum, count) => sum + count,
    0,
  );
  const kneeEntries = Object.entries(data.meta.kneeTypes).sort(
    (a, b) => b[1] - a[1],
  );

  const handleSelect = useCallback((ship: Ship) => setSelected(ship), []);
  const typeLabel = (type: string) => TYPE_LABELS[type]?.[lang] ?? type;

  const fill = Math.min(
    100,
    Math.max(
      0,
      ((threshold - data.meta.tailMin) /
        (MAX_THRESHOLD - data.meta.tailMin)) *
        100,
    ),
  );
  const knee =
    ((data.meta.knee - data.meta.tailMin) /
      (MAX_THRESHOLD - data.meta.tailMin)) *
    100;

  return (
    <div className="page-shell py-10 sm:py-14">
      <Link
        href="/projects/ais-anomaly"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t.aisDemo.back}
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="section-label">{t.aisDemo.eyebrow}</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {t.aisDemo.title}
        </h1>
        <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
          {t.aisDemo.description}
        </p>
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">
          {t.aisDemo.source}
        </p>
      </header>

      <div className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat
              label={t.aisDemo.ships}
              value={integer.format(flagged.length)}
              detail={`${lang === "id" ? "dari" : "of"} ${integer.format(
                data.meta.vessels,
              )} ${lang === "id" ? "kapal" : "vessels"}`}
            />
            <Stat
              label={t.aisDemo.records}
              value={integer.format(records)}
              detail={`${score.format(rate)}%`}
            />
            <Stat
              label={t.aisDemo.rate}
              value={`${score.format(rate)}%`}
              detail={t.aisDemo.ofRecords}
            />
            <Stat
              label={t.aisDemo.thresholdShort}
              value={score.format(threshold)}
              detail={
                activePreset
                  ? (PRESET_LABELS[activePreset.name]?.[lang] ??
                    activePreset.name)
                  : t.aisDemo.custom
              }
            />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="relative isolate overflow-hidden rounded-xl border border-border/70 bg-card">
              <AisMap
                ships={data.ships}
                threshold={effectiveThreshold}
                selected={selected}
                onSelect={handleSelect}
                label={t.aisDemo.mapLabel}
              />
              <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-wrap gap-x-3 gap-y-1 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#0d9488]" />
                  {t.aisDemo.normal}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#ef4444]" />
                  {t.aisDemo.flagged}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#f59e0b]" />
                  {t.aisDemo.selected}
                </span>
              </div>
            </div>

            <aside className="space-y-4 lg:row-span-2">
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label
                      htmlFor="ais-threshold"
                      className="section-label"
                    >
                      {t.aisDemo.threshold}
                    </label>
                    <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
                      {score.format(threshold)}
                    </p>
                  </div>
                  <span className="max-w-28 rounded-md border border-border/70 px-2 py-1 text-right font-mono text-[10px] leading-4 text-muted-foreground">
                    {activePreset
                      ? (PRESET_LABELS[activePreset.name]?.[lang] ??
                        activePreset.name)
                      : t.aisDemo.custom}
                  </span>
                </div>

                <div className="relative mt-6">
                  <div
                    className="pointer-events-none absolute -top-5 z-10"
                    style={{ left: `${knee}%` }}
                  >
                    <span className="-translate-x-1/2 font-mono text-[10px] whitespace-nowrap text-muted-foreground">
                      {t.aisDemo.knee} {score.format(data.meta.knee)}
                    </span>
                  </div>
                  <input
                    id="ais-threshold"
                    type="range"
                    min={data.meta.tailMin}
                    max={MAX_THRESHOLD}
                    step={0.001}
                    value={threshold}
                    onChange={(event) =>
                      setThreshold(Number(event.target.value))
                    }
                    className="ais-range w-full"
                    style={{ "--fill": `${fill}%` } as CSSProperties}
                    aria-valuetext={score.format(threshold)}
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>{score.format(data.meta.tailMin)}</span>
                    <span>{score.format(MAX_THRESHOLD)}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {data.presets.map((preset) => {
                    const active =
                      Math.abs(preset.threshold - threshold) < 0.0005;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setThreshold(preset.threshold)}
                        title={`${t.aisDemo.dbi} ${dbi.format(preset.dbi)}`}
                        className={`min-h-11 rounded-md border px-2.5 text-xs transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {PRESET_LABELS[preset.name]?.[lang] ?? preset.name}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                  {t.aisDemo.dbi}:{" "}
                  {activePreset ? dbi.format(activePreset.dbi) : "—"}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {t.aisDemo.weights}: LSTM{" "}
                  {dbi.format(data.meta.weights.lstm)} · LOF{" "}
                  {dbi.format(data.meta.weights.lof)}
                </p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {t.aisDemo.thresholdHint}
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-5">
                <p className="section-label">{t.aisDemo.composition}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t.aisDemo.compositionHint}
                </p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  {integer.format(kneeTotal)} {t.aisDemo.recordsShort}
                </p>
                <div className="mt-4 space-y-3">
                  {kneeEntries.map(([type, count]) => (
                    <div key={type}>
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span>{typeLabel(type)}</span>
                        <span className="font-mono tabular-nums text-muted-foreground">
                          {integer.format(count)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(count / kneeTotal) * 100}%`,
                            backgroundColor:
                              TYPE_COLORS[type] ?? "var(--chart-4)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-5">
                <p className="section-label">{t.aisDemo.detail}</p>
                {selected ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-lg font-semibold">
                        {selected.mmsi}
                      </p>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] ${
                          selected.score >= effectiveThreshold
                            ? "border-destructive/30 text-destructive"
                            : "border-border/70 text-muted-foreground"
                        }`}
                      >
                        {selected.score >= effectiveThreshold
                          ? t.aisDemo.above
                          : t.aisDemo.below}
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <dt className="text-muted-foreground">
                          {t.aisDemo.type}
                        </dt>
                        <dd className="mt-0.5">{typeLabel(selected.type)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t.aisDemo.confidence}
                        </dt>
                        <dd className="mt-0.5">
                          {selected.confidence === "HIGH"
                            ? t.aisDemo.confidenceHigh
                            : selected.confidence === "MEDIUM"
                              ? t.aisDemo.confidenceMedium
                              : selected.confidence === "LOW"
                                ? t.aisDemo.confidenceLow
                                : t.aisDemo.confidenceNormal}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t.aisDemo.score}
                        </dt>
                        <dd className="mt-0.5 font-mono">
                          {score.format(selected.score)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t.aisDemo.meanScore}
                        </dt>
                        <dd className="mt-0.5 font-mono">
                          {score.format(selected.mean)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t.aisDemo.recordsShort}
                        </dt>
                        <dd className="mt-0.5 font-mono">
                          {integer.format(selected.anom)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t.aisDemo.positions}
                        </dt>
                        <dd className="mt-0.5 font-mono">
                          {integer.format(selected.route.length)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {t.aisDemo.shiptype}
                        </dt>
                        <dd className="mt-0.5 font-mono">
                          {selected.shiptype ?? "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {t.aisDemo.detailHint}
                  </p>
                )}
              </div>
            </aside>

          <section className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
              <div>
                <h2 className="section-label">{t.aisDemo.tableTitle}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.aisDemo.tableHint}
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {integer.format(flagged.length)}
              </span>
            </div>

            {flagged.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                {t.aisDemo.tableEmpty}
              </p>
            ) : (
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">{t.aisDemo.tableTitle}</caption>
                  <thead className="sticky top-0 z-10 bg-card text-[10px] tracking-wider text-muted-foreground uppercase">
                    <tr>
                      <th scope="col" className="px-4 py-2 font-medium">
                        MMSI
                      </th>
                      <th scope="col" className="px-2 py-2 font-medium">
                        {t.aisDemo.typeHeader}
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-2 text-right font-medium"
                      >
                        {t.aisDemo.scoreHeader}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-right font-medium"
                      >
                        {t.aisDemo.recordsHeader}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {flagged.map((ship) => (
                      <tr
                        key={ship.mmsi}
                        className={`border-t border-border/60 ${
                          selected?.mmsi === ship.mmsi ? "bg-accent/60" : ""
                        }`}
                      >
                        <td className="px-4 py-1">
                          <button
                            type="button"
                            onClick={() => handleSelect(ship)}
                            className="min-h-11 font-mono text-xs text-primary hover:underline"
                          >
                            {ship.mmsi}
                          </button>
                        </td>
                        <td className="px-2 py-1 text-xs">
                          {typeLabel(ship.type)}
                        </td>
                        <td className="px-2 py-1 text-right font-mono text-xs tabular-nums">
                          {score.format(ship.score)}
                        </td>
                        <td className="px-4 py-1 text-right font-mono text-xs tabular-nums">
                          {integer.format(ship.anom)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          </div>

        <p className="font-mono text-[11px] leading-5 text-muted-foreground">
          {t.aisDemo.dataNote} · {data.meta.generatedBy} v
          {data.meta.schemaVersion}
        </p>
      </div>
    </div>
  );
}
