"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/github-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/content/site";

export function SiteHeader() {
  const { t } = useI18n();

  const links = [
    { href: "/#projects", label: t.nav.projects },
    { href: "/#labs", label: t.nav.labs },
    { href: "/#about", label: t.nav.about },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Rangga Dewa Yudhistira">
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-mono text-sm font-semibold text-primary-foreground">
            RD
          </span>
          <span className="hidden font-mono text-sm tracking-tight sm:block">
            rangga<span className="text-primary">.</span>devops
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GithubIcon className="size-[18px]" />
            </a>
          </Button>
          {profile.linkedin ? (
            <Button asChild variant="ghost" size="icon">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="size-[18px]" />
              </a>
            </Button>
          ) : null}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <nav
        aria-label="Navigasi utama mobile"
        className="page-shell flex gap-1 overflow-x-auto pb-3 md:hidden"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
