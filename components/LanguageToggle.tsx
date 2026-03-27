"use client"

import { useT } from "./LanguageProvider"

export function LanguageToggle() {
  const { lang, setLang } = useT()

  return (
    <button
      onClick={() => setLang(lang === "sk" ? "en" : "sk")}
      title={lang === "sk" ? "Switch to English" : "Prepnúť na slovenčinu"}
      className="flex h-8 items-center rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-muted transition-colors hover:text-foreground hover:border-muted"
    >
      {lang === "sk" ? "EN" : "SK"}
    </button>
  )
}
