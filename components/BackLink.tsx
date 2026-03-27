"use client"

import Link from "next/link"
import { useT } from "@/components/LanguageProvider"

export function BackLink() {
  const { t } = useT()
  return (
    <Link
      href="/"
      className="text-sm text-muted hover:text-foreground transition-colors"
    >
      {t.back}
    </Link>
  )
}
