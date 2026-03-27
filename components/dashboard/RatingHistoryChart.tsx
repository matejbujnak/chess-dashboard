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
import { format, subMonths, subYears } from "date-fns"

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

const RANGES = [
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1R", months: 12 },
  { label: "Všetko", months: 0 },
]

function buildChartData(points: UnifiedRatingPoint[], selected: TimeControl[], rangeMonths: number) {
  const cutoff = rangeMonths > 0 ? subMonths(new Date(), rangeMonths) : new Date(0)
  const filtered = points.filter((p) => selected.includes(p.timeControl) && p.date >= cutoff)

  // Group by day, per time control — keep last rating of that day
  const byDay = new Map<string, Record<string, number>>()

  for (const p of filtered) {
    const dayKey = format(p.date, "yyyy-MM-dd")
    const existing = byDay.get(dayKey) ?? {}
    // Last game of the day wins (array is sorted asc so later overwrites earlier)
    existing[p.timeControl] = p.rating
    existing["_ts"] = p.date.getTime()
    byDay.set(dayKey, existing)
  }

  // Sort by date and format label
  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dayKey, vals]) => ({
      date: format(new Date(dayKey), "d MMM"),
      fullDate: dayKey,
      ...vals,
    }))
}

export function RatingHistoryChart({ ratingHistory }: Props) {
  const availableTcs = [...new Set(ratingHistory.map((p) => p.timeControl))] as TimeControl[]
  const [selected, setSelected] = useState<TimeControl[]>(availableTcs)
  const [range, setRange] = useState(6)

  const data = buildChartData(ratingHistory, selected, range)

  const toggle = (tc: TimeControl) => {
    setSelected((prev) =>
      prev.includes(tc) ? prev.filter((t) => t !== tc) : [...prev, tc]
    )
  }

  // Smart X-axis — show fewer labels when many points
  const tickInterval = data.length > 60 ? Math.floor(data.length / 12) : data.length > 20 ? Math.floor(data.length / 8) : 0

  if (ratingHistory.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>📈 Rating história</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">Žiadne dáta</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Rating história</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range */}
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r.label}
                onClick={() => setRange(r.months)}
                className="rounded px-2 py-0.5 text-xs transition-all"
                style={{
                  background: range === r.months ? "#3b82f620" : "transparent",
                  color: range === r.months ? "#3b82f6" : "#4a5568",
                  border: `1px solid ${range === r.months ? "#3b82f6" : "#2d3748"}`,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
          {/* TC filter */}
          <div className="flex gap-1">
            {availableTcs.map((tc) => (
              <button
                key={tc}
                onClick={() => toggle(tc)}
                className="rounded-full border px-2.5 py-0.5 text-xs transition-all capitalize"
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
        </div>
      </CardHeader>

      {data.length < 2 ? (
        <p className="py-8 text-center text-sm text-[#4a5568]">Málo dát pre zvolené obdobie</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--subtle)", fontSize: 10 }}
                interval={tickInterval}
              />
              <YAxis
                tick={{ fill: "var(--subtle)", fontSize: 11 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                labelStyle={{ color: "var(--muted)" }}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ?? label}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {selected.map((tc) => (
                <Line
                  key={tc}
                  type="monotone"
                  dataKey={tc}
                  stroke={TC_COLORS[tc] ?? "#3b82f6"}
                  dot={data.length < 30 ? { r: 3, fill: TC_COLORS[tc] } : false}
                  strokeWidth={2}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
