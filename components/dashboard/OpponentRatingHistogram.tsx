"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"

interface Props {
  games: UnifiedGame[]
}

export function OpponentRatingHistogram({ games }: Props) {
  const { t } = useT()

  const rated = games.filter((g) => g.opponentRating > 0)

  if (rated.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>🎯 {t.opponentRatings}</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">{t.noData}</p>
      </Card>
    )
  }

  const ratings = rated.map((g) => g.opponentRating)
  const min = Math.floor(Math.min(...ratings) / 100) * 100
  const max = Math.ceil(Math.max(...ratings) / 100) * 100
  const bucketSize = 100

  // Build buckets
  const buckets = new Map<number, { wins: number; losses: number; draws: number }>()
  for (let r = min; r < max; r += bucketSize) {
    buckets.set(r, { wins: 0, losses: 0, draws: 0 })
  }

  for (const g of rated) {
    const bucket = Math.floor(g.opponentRating / bucketSize) * bucketSize
    const existing = buckets.get(bucket) ?? { wins: 0, losses: 0, draws: 0 }
    if (g.result === "win") existing.wins++
    else if (g.result === "loss") existing.losses++
    else existing.draws++
    buckets.set(bucket, existing)
  }

  const data = Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([rating, v]) => ({
      range: `${rating}`,
      wins: v.wins,
      draws: v.draws,
      losses: v.losses,
      total: v.wins + v.losses + v.draws,
    }))
    .filter((d) => d.total > 0)

  const avgOpponent = Math.round(ratings.reduce((s, r) => s + r, 0) / ratings.length)
  const myAvg = Math.round(games.filter((g) => g.userRating > 0).reduce((s, g) => s + g.userRating, 0) / games.filter((g) => g.userRating > 0).length)

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 {t.opponentRatings}</CardTitle>
        <div className="flex gap-3 text-xs text-[#a0aec0]">
          <span>{t.myAverage}: <span className="font-bold text-white">{myAvg}</span></span>
          <span>{t.opponentsAverage}: <span className="font-bold text-white">{avgOpponent}</span></span>
        </div>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="range"
              tick={{ fill: "var(--subtle)", fontSize: 10 }}
              interval={Math.floor(data.length / 10)}
            />
            <YAxis tick={{ fill: "var(--subtle)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
              labelFormatter={(v) => `Rating ${v}–${Number(v) + bucketSize - 1}`}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="wins" name={t.wins} fill="#10b981" stackId="a" />
            <Bar dataKey="draws" name={t.draws} fill="#a0aec0" stackId="a" />
            <Bar dataKey="losses" name={t.losses} fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
