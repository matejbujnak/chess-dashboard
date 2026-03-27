"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"
import { format } from "date-fns"

interface Props {
  games: UnifiedGame[]
}

export function GamesPerMonth({ games }: Props) {
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
      Výhry: v.wins,
      Remízy: v.draws,
      Prehry: v.losses,
      total: v.wins + v.losses + v.draws,
    }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>📅 Hry za mesiac</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">Žiadne dáta</p>
      </Card>
    )
  }

  const maxTotal = Math.max(...data.map((d) => d.total))

  return (
    <Card>
      <CardHeader>
        <CardTitle>📅 Hry za mesiac</CardTitle>
        <span className="text-xs text-[#4a5568]">
          Najaktívnejší: <span className="text-white">{data.find((d) => d.total === maxTotal)?.month}</span> ({maxTotal} partií)
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
            <Bar dataKey="Výhry" fill="#10b981" stackId="a" />
            <Bar dataKey="Remízy" fill="#a0aec0" stackId="a" />
            <Bar dataKey="Prehry" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
