"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"

interface Props {
  games: UnifiedGame[]
}

export function ColorStats({ games }: Props) {
  const white = games.filter((g) => g.userColor === "white")
  const black = games.filter((g) => g.userColor === "black")

  const data = [
    {
      color: "Biely ♔",
      Výhry: white.filter((g) => g.result === "win").length,
      Remízy: white.filter((g) => g.result === "draw").length,
      Prehry: white.filter((g) => g.result === "loss").length,
    },
    {
      color: "Čierny ♚",
      Výhry: black.filter((g) => g.result === "win").length,
      Remízy: black.filter((g) => g.result === "draw").length,
      Prehry: black.filter((g) => g.result === "loss").length,
    },
  ]

  const whiteWr = white.length > 0 ? ((data[0].Výhry / white.length) * 100).toFixed(0) : "0"
  const blackWr = black.length > 0 ? ((data[1].Výhry / black.length) * 100).toFixed(0) : "0"

  return (
    <Card>
      <CardHeader>
        <CardTitle>♔♚ Biely vs Čierny</CardTitle>
        <div className="flex gap-3 text-xs text-[#a0aec0]">
          <span>♔ Win% <span className="font-bold text-white">{whiteWr}%</span></span>
          <span>♚ Win% <span className="font-bold text-white">{blackWr}%</span></span>
        </div>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="color" tick={{ fill: "var(--muted)", fontSize: 13 }} />
            <YAxis tick={{ fill: "var(--subtle)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Výhry" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="Remízy" fill="#a0aec0" stackId="a" />
            <Bar dataKey="Prehry" fill="#ef4444" radius={[0, 0, 4, 4]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
