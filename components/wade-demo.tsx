"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Combine,
  Download,
  FileImage,
  FileText,
  Images,
  Loader2,
  LockKeyhole,
  Scissors,
  Upload,
  X,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Tool = "compress" | "images" | "merge" | "split";

type ResultState = {
  url: string;
  name: string;
  size: number;
  pages?: number;
};

const TOOLS: readonly Tool[] = ["compress", "images", "merge", "split"];

const ACCEPT: Record<Tool, readonly string[]> = {
  compress: [".jpg", ".jpeg", ".png", ".webp"],
  images: [".jpg", ".jpeg", ".png"],
  merge: [".pdf"],
  split: [".pdf"],
};

const MULTIPLE: Record<Tool, boolean> = {
  compress: false,
  images: true,
  merge: true,
  split: false,
};

const ICONS = {
  compress: FileImage,
  images: Images,
  merge: Combine,
  split: Scissors,
} as const;

const MAX_BYTES = 20 * 1024 * 1024;

function formatSize(bytes: number, locale: string): string {
  const units = ["B", "KB", "MB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value)} ${units[unit]}`;
}

export function WadeDemo() {
  const { t, lang } = useI18n();
  const copy = t.wadeDemo;
  const locale = lang === "id" ? "id-ID" : "en-US";
  const inputRef = useRef<HTMLInputElement>(null);

  const [tool, setTool] = useState<Tool>("compress");
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [range, setRange] = useState("1");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultState | null>(null);

  useEffect(() => {
    if (!result) return;
    return () => URL.revokeObjectURL(result.url);
  }, [result]);

  function clearResult() {
    setResult(null);
    setError("");
  }

  function chooseTool(next: Tool) {
    if (next === tool) return;
    setTool(next);
    setFiles([]);
    setPageCount(null);
    setRange("1");
    setError("");
    setResult(null);
  }

  async function addFiles(incoming: File[]) {
    const accept = ACCEPT[tool];
    const multiple = MULTIPLE[tool];
    const candidates = multiple ? incoming.slice(0, 100) : incoming.slice(0, 1);
    const accepted: File[] = [];
    let problem = "";

    for (const file of candidates) {
      const name = file.name.toLowerCase();
      if (file.size > MAX_BYTES) {
        problem = `${file.name}: ${copy.tooLarge}`;
        continue;
      }
      if (!accept.some((ext) => name.endsWith(ext))) {
        problem = `${file.name}: ${copy.unsupported}`;
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) {
      setError(problem || copy.oneFile);
      return;
    }

    setFiles(accepted);
    setError(problem);
    setResult(null);
    setPageCount(null);

    if (tool === "split") {
      try {
        const { jumlahHalamanPdf } = await import("@/lib/wade");
        setPageCount(await jumlahHalamanPdf(accepted[0]));
      } catch {
        setPageCount(null);
        setError(copy.failed);
      }
    }
  }

  async function handleProcess() {
    const first = files[0];
    if (!first) {
      setError(copy.oneFile);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const wade = await import("@/lib/wade");
      let blob: Blob;
      let name: string;
      let pages: number | undefined;

      if (tool === "compress") {
        blob = await wade.kompresGambar(first, { kualitas: quality });
        name = wade.namaHasilKompres(first.name);
      } else if (tool === "images") {
        const hasil = await wade.gambarKePdf(files);
        blob = hasil.blob;
        pages = hasil.jumlahHalaman;
        name = wade.namaHasilGambarKePdf(first.name);
      } else if (tool === "merge") {
        const hasil = await wade.gabungPdf(files);
        blob = hasil.blob;
        pages = hasil.jumlahHalaman;
        name = wade.namaHasilGabung(first.name);
      } else {
        if (!range.trim()) {
          setError(copy.emptyRange);
          return;
        }
        const total = pageCount ?? (await wade.jumlahHalamanPdf(first));
        const indeks = wade.parseRentang(range, total);
        const hasil = await wade.pisahPdf(first, indeks);
        blob = hasil.blob;
        pages = hasil.jumlahHalaman;
        name = wade.namaHasilPisah(first.name);
      }

      setResult({
        url: URL.createObjectURL(blob),
        name,
        size: blob.size,
        pages,
      });
    } catch (cause) {
      console.error(cause);
      setError(copy.failed);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFiles([]);
    setPageCount(null);
    setRange("1");
    clearResult();
  }

  const firstSize = files[0]?.size ?? 0;
  const change =
    result && tool === "compress" && firstSize > 0
      ? Math.round((1 - result.size / firstSize) * 100)
      : null;

  return (
    <main className="page-shell py-8 sm:py-12">
      <Link
        href="/projects/wade-convert"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {copy.back}
      </Link>

      <div className="mt-6 max-w-2xl">
        <p className="section-label">{copy.eyebrow}</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-4 text-muted-foreground">{copy.description}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          {copy.privacy}
        </p>
      </div>

      <div
        role="tablist"
        aria-label={copy.eyebrow}
        className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {TOOLS.map((id) => {
          const Icon = ICONS[id];
          const active = tool === id;
          return (
            <button
              key={id}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => chooseTool(id)}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {copy.tabs[id]}
            </button>
          );
        })}
      </div>

      <Card
        id={`panel-${tool}`}
        role="tabpanel"
        aria-labelledby={`tab-${tool}`}
        className="mt-4"
      >
        <CardContent className="p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">
            {copy.descriptions[tool]}
          </p>

          <div className="mt-5">
            <div
              role="button"
              tabIndex={0}
              aria-label={copy.choose}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                void addFiles(Array.from(event.dataTransfer.files));
              }}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/60"
              }`}
            >
              <Upload
                className="size-6 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-3 font-medium">{copy.drop}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {copy.dropHint}
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT[tool].join(",")}
              multiple={MULTIPLE[tool]}
              className="hidden"
              onChange={(event) => {
                void addFiles(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />
          </div>

          {files.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{copy.empty}</p>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">
                  {files.length}{" "}
                  {files.length === 1 ? copy.fileSelected : copy.filesSelected}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                >
                  {copy.reset}
                </Button>
              </div>
              <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2"
                  >
                    {tool === "compress" || tool === "images" ? (
                      <FileImage
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    ) : (
                      <FileText
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {file.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatSize(file.size, locale)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${copy.remove}: ${file.name}`}
                      onClick={() => {
                        setFiles((current) =>
                          current.filter((_, i) => i !== index),
                        );
                        setPageCount(null);
                        clearResult();
                      }}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tool === "compress" ? (
            <div className="mt-5">
              <label
                htmlFor="wade-quality"
                className="flex items-center justify-between gap-3 text-sm font-medium"
              >
                <span>{copy.quality}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {Math.round(quality * 100)}%
                </span>
              </label>
              <input
                id="wade-quality"
                type="range"
                min="0.3"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-2 h-11 w-full cursor-pointer accent-primary"
              />
              <p className="text-xs text-muted-foreground">
                {copy.qualityHint}
              </p>
            </div>
          ) : null}

          {tool === "split" ? (
            <div className="mt-5">
              <label
                htmlFor="wade-range"
                className="text-sm font-medium"
              >
                {copy.range}
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  id="wade-range"
                  type="text"
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                  placeholder={copy.rangeHint}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:max-w-52"
                />
                <p className="text-sm text-muted-foreground">
                  {copy.pageCount}{" "}
                  <span className="font-mono">
                    {pageCount === null ? "-" : pageCount}
                  </span>
                </p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy.rangeHint}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="lg"
              disabled={busy || files.length === 0}
              onClick={() => void handleProcess()}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {busy ? copy.processing : copy.process}
            </Button>
            {busy ? (
              <span className="text-sm text-muted-foreground" role="status">
                {copy.processing}
              </span>
            ) : null}
          </div>

          {error ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {result ? (
            <div
              className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4"
              aria-live="polite"
            >
              <p className="text-sm font-semibold">{copy.result}</p>
              <p className="mt-1 break-all font-mono text-sm">{result.name}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {change !== null ? (
                  <span>
                    {copy.before}: {formatSize(firstSize, locale)}
                  </span>
                ) : null}
                <span>
                  {copy.after}: {formatSize(result.size, locale)}
                </span>
                {change !== null ? (
                  <span>
                    {copy.change}: {change}%
                  </span>
                ) : null}
                {result.pages !== undefined ? (
                  <span>
                    {result.pages} {copy.pages}
                  </span>
                ) : null}
              </div>
              <Button asChild size="lg" className="mt-4">
                <a href={result.url} download={result.name}>
                  <Download className="size-4" aria-hidden="true" />
                  {copy.download}
                </a>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">{copy.sourceNote}</p>
    </main>
  );
}
