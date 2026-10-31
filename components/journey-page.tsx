"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function JourneyPageContent() {
  const { t } = useI18n();

  return (
    <main className="page-shell py-8 sm:py-12">
      <Link
        href="/#about"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t.journeyPage.back}
      </Link>

      <div className="mx-auto mt-6 max-w-2xl text-center">
        <p className="section-label">{t.nav.journey}</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t.journeyPage.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t.journeyPage.description}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-dashed border-border/80 bg-card px-6 py-14 text-center">
        <Compass
          className="mx-auto size-6 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="mt-4 font-medium">{t.journeyPage.emptyTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.journeyPage.emptyBody}
        </p>
      </div>
    </main>
  );
}
