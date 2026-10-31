"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { GithubIcon } from "@/components/github-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { SectionHeading } from "@/components/section-heading";
import { useI18n } from "@/components/i18n-provider";
import { profile, journey, skillGroups } from "@/content/site";
import { projects } from "@/content/projects";

export function HomeSections() {
  const { t, lang } = useI18n();

  return (
    <>
      <section id="about" className="page-shell border-t border-border/70 py-16 sm:py-20">
        <SectionHeading label={t.sections.about} title={t.about.title} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {profile.about[lang].map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-6 grid gap-2 font-mono text-xs text-muted-foreground sm:grid-cols-2">
              {profile.focus[lang].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {profile.location[lang]}
              </span>
              <span aria-hidden className="text-border">
                /
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Mail className="size-3.5" />
                {profile.email}
              </a>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-border/70 bg-card p-5">
            <p className="section-label">{t.sections.journey}</p>
            <ol className="mt-4 space-y-5">
              {journey.map((item) => (
                <li
                  key={item.title.en}
                  className="border-l-2 border-border pl-4"
                >
                  <p className="font-mono text-[11px] tracking-wider text-primary uppercase">
                    {item.kind[lang]}
                  </p>
                  <p className="mt-1 text-sm font-medium">{item.title[lang]}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {item.role[lang]}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.detail[lang]}
                  </p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section id="skills" className="page-shell border-t border-border/70 py-16 sm:py-20">
        <SectionHeading label={t.sections.skills} title={t.skills.title} />

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.name.en} className="bg-card p-5">
              <p className="font-mono text-xs text-primary">{group.name[lang]}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge
                      variant="outline"
                      className="rounded-md bg-background font-mono text-[11px] font-normal"
                    >
                      {item}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="page-shell border-t border-border/70 py-16 sm:py-20">
        <SectionHeading
          label={t.sections.projects}
          title={t.projects.title}
          description={t.projects.description}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.slug}
              className="h-full border border-border/70 bg-card ring-0 transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                    {project.category[lang]}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {project.period}
                  </span>
                </div>
                <h3 className="mt-1 font-heading text-xl font-medium">
                  {project.name}
                </h3>
                <CardDescription>{project.tagline[lang]}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="rounded-md font-mono text-[11px] font-normal"
                  >
                    {item}
                  </Badge>
                ))}
              </CardContent>

              <CardContent className="grid grid-cols-2 gap-3 border-t border-border/70 pt-4">
                {project.outcomes.slice(0, 2).map((outcome) => (
                  <div key={outcome.value}>
                    <p className="font-mono text-lg font-semibold tabular-nums">
                      {outcome.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {outcome.label[lang]}
                    </p>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="mt-auto gap-2 border-t border-border/70 bg-transparent">
                <Button asChild size="sm">
                  <Link href={`/projects/${project.slug}`}>
                    {t.actions.viewCaseStudy}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                {project.demo ? (
                  <Button asChild size="sm" variant="ghost">
                    <Link href={project.demo}>{t.actions.openDemo}</Link>
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section id="labs" className="page-shell border-t border-border/70 py-16 sm:py-20">
        <SectionHeading
          label={t.sections.labs}
          title={t.labs.title}
          description={t.labs.description}
        />

        <div className="mt-10 divide-y divide-border/70 overflow-hidden rounded-xl border border-border/70 bg-card">
          {projects
            .filter((project) => project.demo)
            .map((project) => (
              <div
                key={project.slug}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                    </span>
                    <p className="text-sm font-medium">{project.name}</p>
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                      live
                    </span>
                  </div>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    {project.demoNote?.[lang] ?? project.tagline[lang]}
                  </p>
                </div>
                {project.demo ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={project.demo}>
                      {t.actions.openDemo}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            ))}
        </div>
      </section>

      <section id="contact" className="border-t border-border/70">
        <div className="page-shell py-20 sm:py-24">
          <p className="section-label">{t.sections.contact}</p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            {t.contact.body}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">
                <Send className="size-4" />
                {t.contact.openForm}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`mailto:${profile.email}`}>
                <Mail className="size-4" />
                {t.actions.emailMe}
              </a>
            </Button>
            {profile.linkedin ? (
              <Button asChild size="lg" variant="outline">
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <LinkedinIcon className="size-4" />
                  LinkedIn
                </a>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <GithubIcon className="size-4" />
                GitHub
              </a>
            </Button>
          </div>

          <p className="mt-6 font-mono text-xs text-muted-foreground">
            {profile.email}
          </p>
        </div>
      </section>
    </>
  );
}
