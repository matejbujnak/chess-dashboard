"use client"
import { useT } from "@/components/LanguageProvider"
import type { Translations } from "@/lib/i18n/translations"

interface Props {
  icon: string
  tKey: keyof Pick<Translations, "featureRating" | "featureOpenings" | "featureHeatmap">
}

export function FeatureItem({ icon, tKey }: Props) {
  const { t } = useT()
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-subtle">{t[tKey]}</span>
    </div>
  )
}
