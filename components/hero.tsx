"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/github-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { useI18n } from "@/components/i18n-provider";
import { profile } from "@/content/site";

const STACK = [
  "Linux",
  "Git",
  "Docker",
  "GitHub Actions",
  "FastAPI",
  "Next.js",
];

export function Hero({
  hasCv,
  hasPhoto,
}: {
  hasCv: boolean;
  hasPhoto: boolean;
}) {
  const { t } = useI18n();

  return (
    <section className="page-shell pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        className={
          hasPhoto
            ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]"
            : "max-w-3xl"
        }
      >
        <div className="min-w-0 max-w-3xl">
          <Badge
            variant="outline"
            className="h-7 gap-2 rounded-full bg-card/60 px-3 font-mono text-[11px] font-normal tracking-wide text-muted-foreground"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            {t.hero.status}
          </Badge>

          <h1 className="mt-7 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Rangga Dewa Yudhistira
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-muted-foreground">
            <span className="text-primary">{t.hero.role}</span>
            <span aria-hidden className="text-border">
              /
            </span>
            <span>{t.hero.location}</span>
          </div>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            {t.hero.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <GithubIcon className="size-4" />
                {t.actions.viewGithub}
              </a>
            </Button>
            {profile.linkedin ? (
              <Button asChild size="lg" variant="outline">
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <LinkedinIcon className="size-4" />
                  {t.actions.viewLinkedIn}
                </a>
              </Button>
            ) : null}
            {hasCv ? (
              <Button asChild size="lg" variant="outline">
                <a href="/cv.pdf" download>
                  <FileText className="size-4" />
                  {t.actions.viewCv}
                </a>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline">
              <Link href="/#projects">
                {t.actions.viewProjects}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-6 font-mono text-xs text-muted-foreground">
            {STACK.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        {hasPhoto ? (
          <div className="mx-auto w-full max-w-72 lg:mx-0 lg:justify-self-end">
            <div className="rounded-full border border-border/70 bg-card p-1.5 shadow-sm">
              <div className="overflow-hidden rounded-full">
                <Image
                  src="/foto-profil.png"
                  alt="Rangga Dewa Yudhistira"
                  width={720}
                  height={720}
                  priority
                  className="aspect-square w-full object-cover object-bottom"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
