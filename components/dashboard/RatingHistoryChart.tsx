"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedRatingPoint, TimeControl } from "@/lib/unified/types"
import { format } from "date-fns"

interface Props {
  ratingHistory: UnifiedRatingPoint[]
}

const TC_COLORS: Record<string, string> = {
  bullet: "#ef4444",
  blitz: "#f59e0b",
  rapid: "#3b82f6",
  classical: "#10b981",
  daily: "#8b5cf6",
}

function buildChartData(points: UnifiedRatingPoint[], selected: TimeControl[]) {
  // Group by month for readability when there are many points
  const byTcAndDate = new Map<string, Map<string, number>>()

  for (const p of points) {
    if (!selected.includes(p.timeControl)) continue
    const key = format(p.date, "MMM yy")
    if (!byTcAndDate.has(key)) byTcAndDate.set(key, new Map())
    byTcAndDate.get(key)!.set(p.timeControl, p.rating)
  }

  return Array.from(byTcAndDate.entries()).map(([date, tcs]) => ({
    date,
    ...Object.fromEntries(tcs.entries()),
  }))
}

export function RatingHistoryChart({ ratingHistory }: Props) {
  const availableTcs = [...new Set(ratingHistory.map((p) => p.timeControl))] as TimeControl[]
  const [selected, setSelected] = useState<TimeControl[]>(availableTcs)

  const data = buildChartData(ratingHistory, selected)

  const toggle = (tc: TimeControl) => {
    setSelected((prev) =>
      prev.includes(tc) ? prev.filter((t) => t !== tc) : [...prev, tc]
    )
  }

  if (ratingHistory.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Rating história</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">Žiadne dáta</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Rating história</CardTitle>
        <div className="flex flex-wrap gap-2">
          {availableTcs.map((tc) => (
            <button
              key={tc}
              onClick={() => toggle(tc)}
              className="flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-all"
              style={{
                borderColor: selected.includes(tc) ? TC_COLORS[tc] : "#2d3748",
                color: selected.includes(tc) ? TC_COLORS[tc] : "#4a5568",
                background: selected.includes(tc) ? `${TC_COLORS[tc]}15` : "transparent",
              }}
            >
              {tc}
            </button>
          ))}
        </div>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="date" tick={{ fill: "#4a5568", fontSize: 11 }} />
            <YAxis tick={{ fill: "#4a5568", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 8 }}
              labelStyle={{ color: "#a0aec0" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {selected.map((tc) => (
              <Line
                key={tc}
                type="monotone"
                dataKey={tc}
                stroke={TC_COLORS[tc] ?? "#3b82f6"}
                dot={false}
                strokeWidth={2}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
