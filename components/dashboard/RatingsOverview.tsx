"use client"

import { Card } from "@/components/ui/card"
import { winRate } from "@/lib/utils"
import type { UnifiedRating } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"

const TIME_ICONS: Record<string, string> = {
  bullet: "⚡", blitz: "🔥", rapid: "⏱", classical: "♟",
  daily: "📅", puzzle: "🧩", correspondence: "✉️",
}

interface Props { ratings: UnifiedRating[] }

export function RatingsOverview({ ratings }: Props) {
  const { t } = useT()

  const sorted = [...ratings].sort((a, b) => {
    const order = ["bullet", "blitz", "rapid", "classical", "daily", "puzzle"]
    return order.indexOf(a.timeControl) - order.indexOf(b.timeControl)
  })

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{t.ratingsOverview}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {sorted.map((r) => (
          <Card key={r.label} className="flex flex-col gap-1 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg">{TIME_ICONS[r.timeControl] ?? "♟"}</span>
              <span className="text-xs text-subtle">{r.label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{r.current}</div>
            {r.best && r.best !== r.current && (
              <div className="text-xs text-success">{t.bestRating}: {r.best}</div>
            )}
            {r.total > 0 && (
              <div className="mt-1 space-y-0.5 text-xs text-muted">
                <div className="flex justify-between">
                  <span>{t.games}</span>
                  <span className="text-foreground">{r.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Win%</span>
                  <span className="text-success">{winRate(r.wins, r.losses, r.draws)}</span>
                </div>
              </div>
            )}
            {r.total > 0 && (
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-border">
                <div className="bg-success" style={{ width: `${(r.wins / r.total) * 100}%` }} />
                <div className="bg-muted" style={{ width: `${(r.draws / r.total) * 100}%` }} />
                <div className="bg-danger" style={{ width: `${(r.losses / r.total) * 100}%` }} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
