"use client"
import { useT } from "@/components/LanguageProvider"

export function LandingText() {
  const { t } = useT()
  return <p className="max-w-sm text-muted">{t.tagline}</p>
}
