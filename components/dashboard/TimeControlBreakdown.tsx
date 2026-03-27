"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame, TimeControl } from "@/lib/unified/types"

interface Props {
  games: UnifiedGame[]
}

const TC_COLORS: Record<string, string> = {
  bullet: "#ef4444",
  blitz: "#f59e0b",
  rapid: "#3b82f6",
  classical: "#10b981",
  daily: "#8b5cf6",
  correspondence: "#ec4899",
}

export function TimeControlBreakdown({ games }: Props) {
  const byTc = new Map<TimeControl, { wins: number; losses: number; draws: number }>()

  for (const g of games) {
    const existing = byTc.get(g.timeClass) ?? { wins: 0, losses: 0, draws: 0 }
    if (g.result === "win") existing.wins++
    else if (g.result === "loss") existing.losses++
    else existing.draws++
    byTc.set(g.timeClass, existing)
  }

  const data = Array.from(byTc.entries()).map(([tc, stats]) => ({
    tc,
    Výhry: stats.wins,
    Prehry: stats.losses,
    Remízy: stats.draws,
    total: stats.wins + stats.losses + stats.draws,
  }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Výsledky podľa tempa</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">Žiadne dáta</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>⏱ Výsledky podľa tempa</CardTitle>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="tc" tick={{ fill: "#a0aec0", fontSize: 12 }} />
            <YAxis tick={{ fill: "#4a5568", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 8 }}
            />
            <Bar dataKey="Výhry" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="Remízy" fill="#a0aec0" stackId="a" />
            <Bar dataKey="Prehry" fill="#ef4444" radius={[0, 0, 4, 4]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
