"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"
import { format } from "date-fns"
import { useT } from "@/components/LanguageProvider"

interface Props {
  games: UnifiedGame[]
}

export function GamesPerMonth({ games }: Props) {
  const { t } = useT()

  const byMonth = new Map<string, { wins: number; losses: number; draws: number; ts: number }>()

  for (const g of games) {
    const key = format(g.playedAt, "MMM yy")
    const ts = new Date(format(g.playedAt, "yyyy-MM-01")).getTime()
    const existing = byMonth.get(key) ?? { wins: 0, losses: 0, draws: 0, ts }
    if (g.result === "win") existing.wins++
    else if (g.result === "loss") existing.losses++
    else existing.draws++
    byMonth.set(key, existing)
  }

  const data = Array.from(byMonth.entries())
    .sort(([, a], [, b]) => a.ts - b.ts)
    .map(([month, v]) => ({
      month,
      wins: v.wins,
      draws: v.draws,
      losses: v.losses,
      total: v.wins + v.losses + v.draws,
    }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>📅 {t.gamesPerMonth}</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">{t.noData}</p>
      </Card>
    )
  }

  const maxTotal = Math.max(...data.map((d) => d.total))

  return (
    <Card>
      <CardHeader>
        <CardTitle>📅 {t.gamesPerMonth}</CardTitle>
        <span className="text-xs text-[#4a5568]">
          {t.mostActive}: <span className="text-white">{data.find((d) => d.total === maxTotal)?.month}</span> ({maxTotal} {t.games})
        </span>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--subtle)", fontSize: 10 }} />
            <YAxis tick={{ fill: "var(--subtle)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
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
