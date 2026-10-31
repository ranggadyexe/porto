"use client";

import Link from "next/link";
import { GithubIcon } from "@/components/github-icon";
import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/content/site";

export function SiteFooter({ year }: { year: number }) {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/70">
      <div className="page-shell flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} Rangga Dewa Yudhistira. {t.footer.rights}
        </p>
        <p className="font-mono text-xs">{t.footer.built}</p>
        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
          <Link
            href="/#contact"
            className="transition-colors hover:text-foreground"
          >
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </footer>
  );
}
