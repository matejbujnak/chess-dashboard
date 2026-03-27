"use client"

import { useT } from "@/components/LanguageProvider"
import type { DashboardData } from "@/lib/unified/types"

interface Props {
  a: DashboardData
  b: DashboardData
}

const TIME_CONTROLS = ["bullet", "blitz", "rapid", "classical", "daily"] as const

export function CompareRatingTable({ a, b }: Props) {
  const { t } = useT()

  const rows = TIME_CONTROLS.map((tc) => {
    const ra = a.ratings.find((r) => r.timeControl === tc)
    const rb = b.ratings.find((r) => r.timeControl === tc)
    if (!ra && !rb) return null
    const ratingA = ra?.current ?? null
    const ratingB = rb?.current ?? null
    let advantage: "a" | "b" | null = null
    if (ratingA !== null && ratingB !== null) {
      if (ratingA > ratingB) advantage = "a"
      else if (ratingB > ratingA) advantage = "b"
    }
    return { tc, label: ra?.label ?? rb?.label ?? tc, ratingA, ratingB, advantage }
  }).filter(Boolean) as {
    tc: string
    label: string
    ratingA: number | null
    ratingB: number | null
    advantage: "a" | "b" | null
  }[]

  if (rows.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">{t.ratingCompareTitle}</h3>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => {
          const diff =
            row.ratingA !== null && row.ratingB !== null
              ? Math.abs(row.ratingA - row.ratingB)
              : null

          return (
            <div key={row.tc} className="grid grid-cols-3 items-center px-5 py-3 text-sm">
              <div
                className={`font-bold text-lg ${row.advantage === "a" ? "text-blue-400" : "text-foreground"}`}
              >
                {row.ratingA ?? <span className="text-subtle">{t.noRating}</span>}
                {row.advantage === "a" && diff !== null && (
                  <span className="ml-1 text-xs text-blue-400">+{diff}</span>
                )}
              </div>
              <div className="text-center text-xs text-muted">{row.label}</div>
              <div
                className={`text-right font-bold text-lg ${row.advantage === "b" ? "text-amber-400" : "text-foreground"}`}
              >
                {row.advantage === "b" && diff !== null && (
                  <span className="mr-1 text-xs text-amber-400">+{diff}</span>
                )}
                {row.ratingB ?? <span className="text-subtle">{t.noRating}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
