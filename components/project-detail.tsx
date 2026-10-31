"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/github-icon";
import { useI18n } from "@/components/i18n-provider";
import type { Project } from "@/content/projects";

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="section-label">{label}</p>
      <div className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}

function StepList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 font-mono text-xs text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const { t, lang } = useI18n();

  return (
    <article className="page-shell py-12 sm:py-16">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t.nav.projects}
      </Link>

      <header className="mt-6 border-b border-border/70 pb-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          <span className="text-primary">{project.category[lang]}</span>
          <span aria-hidden className="text-border">
            /
          </span>
          <span>{project.period}</span>
        </div>

        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.name}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {project.tagline[lang]}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.demo ? (
            <Button asChild size="lg">
              <Link href={project.demo}>
                {t.actions.openDemo}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          ) : null}
          {project.repo ? (
            <Button asChild size="lg" variant="outline">
              <a href={project.repo} target="_blank" rel="noreferrer">
                <GithubIcon className="size-4" />
                {t.actions.viewCode}
              </a>
            </Button>
          ) : null}
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {t.caseStudy.role}: {project.role[lang]}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="space-y-10">
          <Section label={t.caseStudy.problem}>
            <p className="text-pretty">{project.problem[lang]}</p>
          </Section>

          <Section label={t.caseStudy.approach}>
            <p className="text-pretty">{project.approach[lang]}</p>
          </Section>

          <Section label={t.caseStudy.architecture}>
            <StepList items={project.architecture[lang]} />
          </Section>

          <Section label={t.caseStudy.pipeline}>
            <StepList items={project.pipeline[lang]} />
          </Section>

          <Section label={t.caseStudy.security}>
            <StepList items={project.security[lang]} />
          </Section>
        </div>

        <aside className="order-first h-fit rounded-xl border border-border/70 bg-card p-5 lg:order-none lg:sticky lg:top-24">
          <p className="section-label">{t.caseStudy.outcomes}</p>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            {project.outcomes.map((outcome) => (
              <div key={outcome.value}>
                <dt className="text-xs leading-4 text-muted-foreground">
                  {outcome.label[lang]}
                </dt>
                <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums">
                  {outcome.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-border/70 pt-4">
            <p className="section-label">{t.caseStudy.stack}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <li key={item}>
                  <Badge
                    variant="secondary"
                    className="rounded-md font-mono text-[11px] font-normal"
                  >
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
