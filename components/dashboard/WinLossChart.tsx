"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"

interface Props {
  games: UnifiedGame[]
}

export function WinLossChart({ games }: Props) {
  const wins = games.filter((g) => g.result === "win").length
  const losses = games.filter((g) => g.result === "loss").length
  const draws = games.filter((g) => g.result === "draw").length
  const total = games.length

  const data = [
    { name: "Výhry", value: wins, color: "#10b981" },
    { name: "Prehry", value: losses, color: "#ef4444" },
    { name: "Remízy", value: draws, color: "#a0aec0" },
  ].filter((d) => d.value > 0)

  if (total === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Výsledky</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">Žiadne partii</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Výsledky partií</CardTitle>
        <span className="text-xs text-[#4a5568]">{total} partií</span>
      </CardHeader>
      <div className="flex items-center gap-4">
        <div className="h-48 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 8 }}
                formatter={(value, name) => [
                  `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 pr-2">
          {[
            { label: "Výhry", value: wins, color: "#10b981" },
            { label: "Prehry", value: losses, color: "#ef4444" },
            { label: "Remízy", value: draws, color: "#a0aec0" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ background: item.color }} />
              <div>
                <div className="text-sm font-semibold text-white">{item.value}</div>
                <div className="text-xs text-[#a0aec0]">
                  {item.label} ({((item.value / total) * 100).toFixed(0)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
