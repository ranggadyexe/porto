"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      aria-label={t.language.label}
      className="font-mono text-xs font-semibold"
    >
      {lang === "id" ? "EN" : "ID"}
    </Button>
  );
}
