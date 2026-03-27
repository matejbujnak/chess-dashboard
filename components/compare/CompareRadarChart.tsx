"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { useT } from "@/components/LanguageProvider"
import type { DashboardData } from "@/lib/unified/types"

interface Props {
  a: DashboardData
  b: DashboardData
  nameA: string
  nameB: string
}

function calcMetrics(data: DashboardData) {
  const games = data.games
  const total = games.length
  const wins = games.filter((g) => g.result === "win").length
  const draws = games.filter((g) => g.result === "draw").length
  const wr = total > 0 ? (wins / total) * 100 : 0
  const dr = total > 0 ? (draws / total) * 100 : 0

  const accuracyGames = games.filter((g) => g.accuracy !== null)
  const avgAccuracy =
    accuracyGames.length > 0
      ? accuracyGames.reduce((s, g) => s + (g.accuracy ?? 0), 0) / accuracyGames.length
      : null

  // Activity: games per month — approximate from date range
  const dates = games.map((g) => g.playedAt.getTime()).sort((a, b) => a - b)
  let gpm = 0
  if (dates.length >= 2) {
    const span = (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24 * 30)
    gpm = span > 0 ? total / span : total
  }

  // Best rating across all time controls
  const ratings = data.ratings
  const bestRating = ratings.length > 0 ? Math.max(...ratings.map((r) => r.current)) : 0

  return { wr, dr, avgAccuracy, gpm, bestRating }
}

export function CompareRadarChart({ a, b, nameA, nameB }: Props) {
  const { t } = useT()

  const ma = calcMetrics(a)
  const mb = calcMetrics(b)

  // Normalize each metric to 0-100 relative to both players
  function norm(va: number, vb: number) {
    const max = Math.max(va, vb)
    if (max === 0) return { na: 50, nb: 50 }
    return { na: Math.round((va / max) * 100), nb: Math.round((vb / max) * 100) }
  }

  const wr = norm(ma.wr, mb.wr)
  const dr = norm(ma.dr, mb.dr)
  const acc = norm(ma.avgAccuracy ?? 0, mb.avgAccuracy ?? 0)
  const gpm = norm(ma.gpm, mb.gpm)
  const rat = norm(ma.bestRating, mb.bestRating)

  const data = [
    { subject: t.winRate,  a: wr.na,  b: wr.nb  },
    { subject: t.drawRate, a: dr.na,  b: dr.nb  },
    { subject: t.accuracy, a: acc.na, b: acc.nb },
    { subject: t.activity, a: gpm.na, b: gpm.nb },
    { subject: "Rating",   a: rat.na, b: rat.nb },
  ]

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 font-semibold text-foreground">{t.radarTitle}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <Radar
              name={nameA}
              dataKey="a"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name={nameB}
              dataKey="b"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "var(--muted)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
