"use client"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import { useT } from "@/components/LanguageProvider"
import type { UnifiedGame } from "@/lib/unified/types"
import { format } from "date-fns"

interface Props {
  eco: string
  name: string
  games: UnifiedGame[]
  onClose: () => void
}

interface ColorStats {
  wins: number
  draws: number
  losses: number
  total: number
}

function computeColorStats(games: UnifiedGame[]): { white: ColorStats; black: ColorStats } {
  const white: ColorStats = { wins: 0, draws: 0, losses: 0, total: 0 }
  const black: ColorStats = { wins: 0, draws: 0, losses: 0, total: 0 }

  for (const g of games) {
    const side = g.userColor === "white" ? white : black
    side.total++
    if (g.result === "win") side.wins++
    else if (g.result === "draw") side.draws++
    else side.losses++
  }

  return { white, black }
}

function computeMonthlyTrend(games: UnifiedGame[]) {
  const map = new Map<string, { wins: number; total: number }>()

  const sorted = [...games].sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime())

  for (const g of sorted) {
    const key = format(g.playedAt, "yyyy-MM")
    const existing = map.get(key) ?? { wins: 0, total: 0 }
    existing.total++
    if (g.result === "win") existing.wins++
    map.set(key, existing)
  }

  return Array.from(map.entries())
    .slice(-12) // last 12 months
    .map(([month, { wins, total }]) => ({
      month: month.slice(5), // "MM"
      winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
      games: total,
    }))
}

function ColorBar({ label, stats, color }: { label: string; stats: ColorStats; color: string }) {
  if (stats.total === 0) return null
  const winPct = Math.round((stats.wins / stats.total) * 100)
  const drawPct = Math.round((stats.draws / stats.total) * 100)
  const lossPct = 100 - winPct - drawPct

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted">{stats.total} partií</span>
      </div>
      {/* Stacked progress bar */}
      <div className="flex h-3 w-full rounded-full overflow-hidden gap-px">
        {winPct > 0 && (
          <div style={{ width: `${winPct}%`, background: "#10b981" }} title={`Win ${winPct}%`} />
        )}
        {drawPct > 0 && (
          <div style={{ width: `${drawPct}%`, background: "#f59e0b" }} title={`Draw ${drawPct}%`} />
        )}
        {lossPct > 0 && (
          <div style={{ width: `${lossPct}%`, background: "#ef4444" }} title={`Loss ${lossPct}%`} />
        )}
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-1 text-[10px] text-muted">
        <span style={{ color: "#10b981" }}>{winPct}% W</span>
        <span style={{ color: "#f59e0b" }}>{drawPct}% D</span>
        <span style={{ color: "#ef4444" }}>{lossPct}% L</span>
      </div>
    </div>
  )
}

export function OpeningDetail({ eco, name, games, onClose }: Props) {
  const { t } = useT()
  const relevant = games.filter((g) => {
    const key = g.openingEco ?? g.openingName
    return eco ? key === eco : g.openingName === name
  })
  const { white, black } = computeColorStats(relevant)
  const trend = computeMonthlyTrend(relevant)

  const totalWinRate =
    relevant.length > 0
      ? Math.round((relevant.filter((g) => g.result === "win").length / relevant.length) * 100)
      : 0

  return (
    <div className="rounded-xl border border-border bg-surface mt-3 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {eco && (
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface-alt text-accent border border-border">
                {eco}
              </span>
            )}
            <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          </div>
          <p className="text-xs text-muted mt-0.5">
            {relevant.length} {t.games} · {t.wins}: {totalWinRate}%
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-foreground transition-colors text-lg leading-none ml-4 shrink-0"
          title={t.close}
        >
          ×
        </button>
      </div>

      {/* White vs Black bars */}
      <div className="flex gap-6 mb-5">
        <ColorBar label={t.asWhite} stats={white} color="#10b981" />
        <ColorBar label={t.asBlack} stats={black} color="#10b981" />
      </div>

      {/* Monthly trend chart */}
      {trend.length >= 2 && (
        <>
          <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">
            {t.monthlyTrend}
          </p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ left: -10, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--subtle)", fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "var(--subtle)", fontSize: 10 }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                  formatter={(value, _, props) => [
                    `${value}% (${props.payload?.games} ${t.games})`,
                    "Win%",
                  ]}
                />
                <ReferenceLine y={50} stroke="var(--border)" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="winRate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
