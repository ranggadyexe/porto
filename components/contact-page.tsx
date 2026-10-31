"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { useI18n } from "@/components/i18n-provider";

export function ContactPageContent() {
  const { t } = useI18n();

  return (
    <main className="page-shell py-8 sm:py-12">
      <Link
        href="/#contact"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t.contactPage.back}
      </Link>

      <div className="mx-auto mt-6 max-w-2xl text-center">
        <p className="section-label">{t.sections.contact}</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t.contactPage.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t.contactPage.description}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <ContactForm />
      </div>
    </main>
  );
}
