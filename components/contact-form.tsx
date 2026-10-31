"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ContactForm() {
  const { t } = useI18n();
  const copy = t.contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border/70 bg-card p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium">
            {copy.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium">
            {copy.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="text-sm font-medium">
          {copy.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder={copy.messagePlaceholder}
          className={`${fieldClass} h-auto resize-y py-3`}
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {status === "sending" ? copy.sending : copy.submit}
        </Button>
        <p className="text-xs text-muted-foreground">{copy.privacy}</p>
      </div>

      {status === "success" ? (
        <p className="mt-4 text-sm text-primary" role="status">
          {copy.success}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {copy.error}
        </p>
      ) : null}
    </form>
  );
}
