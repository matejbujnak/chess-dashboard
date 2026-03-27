"use client"

import { useT } from "@/components/LanguageProvider"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function TimeControlFilter() {
  const { t } = useT()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = searchParams.get("tc") || "all"

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("tc")
    } else {
      params.set("tc", value)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="relative">
      <select
        value={current}
        onChange={handleChange}
        className="h-8 appearance-none rounded-lg border border-border bg-surface pl-3 pr-7 text-xs font-semibold text-muted outline-none transition-colors hover:border-muted hover:text-foreground focus:ring-1 focus:ring-accent w-24 sm:w-28 capitalize"
      >
        <option value="all">{t.timeControlAll}</option>
        <option value="bullet">Bullet</option>
        <option value="blitz">Blitz</option>
        <option value="rapid">Rapid</option>
        <option value="classical">Classical</option>
        <option value="daily">Daily</option>
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}
