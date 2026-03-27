"use client"

import { useState } from "react"
import { useT } from "@/components/LanguageProvider"
import { Link2, Check } from "lucide-react"

export function CopyLinkButton() {
  const { t } = useT()
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (typeof window === "undefined") return
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-foreground hover:border-muted"
      title={copied ? t.copied : t.copyLink}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4" />}
    </button>
  )
}
