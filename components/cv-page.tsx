"use client";

import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function CvPageContent({ hasCv }: { hasCv: boolean }) {
  const { t } = useI18n();

  return (
    <main className="page-shell py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.cvPage.back}
        </Link>

        {hasCv ? (
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <a
                href="/cv.pdf"
                download="Rangga-Dewa-Yudhistira-CV.pdf"
              >
                <Download className="size-4" aria-hidden="true" />
                {t.cvPage.download}
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="/cv.pdf" target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" aria-hidden="true" />
                {t.cvPage.open}
              </a>
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="section-label">{t.cvPage.title}</p>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {t.cvPage.description}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border/70 bg-white">
        {hasCv ? (
          <iframe
            src="/cv.pdf#view=FitH"
            title={t.cvPage.title}
            className="h-[72vh] min-h-[480px] w-full"
          />
        ) : (
          <p className="px-6 py-20 text-center text-sm text-muted-foreground">
            {t.cvPage.empty}
          </p>
        )}
      </div>

      {hasCv ? (
        <p className="mt-3 text-xs text-muted-foreground">{t.cvPage.hint}</p>
      ) : null}
    </main>
  );
}
