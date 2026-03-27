"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { BestWin } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"

interface Props {
  bestWins: BestWin[]
}

const TC_ICONS: Record<string, string> = {
  bullet: "⚡",
  blitz: "🔥",
  rapid: "⏱",
  classical: "♟",
  daily: "📅",
}

export function BestWins({ bestWins }: Props) {
  const { t } = useT()

  if (bestWins.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>🏆 {t.bestWins}</CardTitle></CardHeader>
        <p className="text-center text-sm text-subtle py-8">{t.noWins}</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 {t.bestWins}</CardTitle>
        <span className="text-xs text-subtle">{t.byOpponentRating}</span>
      </CardHeader>
      <div className="space-y-2">
        {bestWins.slice(0, 8).map((win, i) => (
          <div
            key={win.gameId}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface-alt px-3 py-2"
          >
            <div className="w-5 text-center text-xs font-bold text-subtle">
              #{i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {win.opponentUsername}
                </span>
                <Badge variant={win.platform === "chesscom" ? "chesscom" : "lichess"} className="shrink-0">
                  {win.platform === "chesscom" ? "CC" : "Li"}
                </Badge>
              </div>
              <div className="text-xs text-subtle">{formatDate(win.playedAt)}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-success">{win.opponentRating}</div>
              <div className="text-xs text-subtle">{TC_ICONS[win.timeClass]} {win.timeClass}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
