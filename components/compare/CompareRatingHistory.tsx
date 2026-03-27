"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useT } from "@/components/LanguageProvider"
import type { DashboardData } from "@/lib/unified/types"
import { format } from "date-fns"

interface Props {
  a: DashboardData
  b: DashboardData
  nameA: string
  nameB: string
}

export function CompareRatingHistory({ a, b, nameA, nameB }: Props) {
  const { t } = useT()

  // Use the most common time control for each player (most rating points)
  function dominantTC(data: DashboardData) {
    const counts: Record<string, number> = {}
    for (const p of data.ratingHistory) {
      counts[p.timeControl] = (counts[p.timeControl] ?? 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "blitz"
  }

  const tcA = dominantTC(a)
  const tcB = dominantTC(b)

  const histA = a.ratingHistory
    .filter((p) => p.timeControl === tcA)
    .sort((x, y) => x.date.getTime() - y.date.getTime())

  const histB = b.ratingHistory
    .filter((p) => p.timeControl === tcB)
    .sort((x, y) => x.date.getTime() - y.date.getTime())

  if (histA.length === 0 && histB.length === 0) return null

  // Merge timelines
  const keyA = new Map(histA.map((p) => [format(p.date, "yyyy-MM-dd"), p.rating]))
  const keyB = new Map(histB.map((p) => [format(p.date, "yyyy-MM-dd"), p.rating]))

  const allDates = Array.from(
    new Set([...keyA.keys(), ...keyB.keys()])
  ).sort()

  // Forward-fill
  let lastA: number | null = null
  let lastB: number | null = null
  const chartData = allDates.map((d) => {
    if (keyA.has(d)) lastA = keyA.get(d)!
    if (keyB.has(d)) lastB = keyB.get(d)!
    return { date: d, a: lastA, b: lastB }
  })

  // Thin to max 200 points
  const step = Math.max(1, Math.floor(chartData.length / 200))
  const thinned = chartData.filter((_, i) => i % step === 0 || i === chartData.length - 1)

  const allRatings = thinned.flatMap((d) => [d.a, d.b]).filter((v): v is number => v !== null)
  const minR = Math.min(...allRatings)
  const maxR = Math.max(...allRatings)
  const pad = Math.max(20, Math.round((maxR - minR) * 0.1))

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 font-semibold text-foreground">{t.ratingHistoryCompare}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={thinned} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickFormatter={(v) => {
                const d = new Date(v)
                return format(d, "MMM yy")
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minR - pad, maxR + pad]}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              labelFormatter={(v) => format(new Date(v), "d MMM yyyy")}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "var(--muted)" }} />
            <Line
              type="monotone"
              dataKey="a"
              name={nameA}
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="b"
              name={nameB}
              stroke="#f59e0b"
              dot={false}
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
