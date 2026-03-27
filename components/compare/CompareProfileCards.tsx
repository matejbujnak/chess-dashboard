"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatNumber } from "@/lib/utils"
import { useT } from "@/components/LanguageProvider"
import type { DashboardData } from "@/lib/unified/types"

interface Props {
  a: DashboardData
  b: DashboardData
}

function MiniProfile({ data, color }: { data: DashboardData; color: string }) {
  const { t } = useT()
  const p = data.player
  const avatarUrl =
    p.avatarUrl ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username)}&background=1a1f2e&color=e2e8f0&size=128&bold=true`

  const wins = data.games.filter((g) => g.result === "win").length
  const total = data.games.length
  const wr = total > 0 ? ((wins / total) * 100).toFixed(1) : "0"

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-5 text-center flex-1">
      <div className="h-1.5 w-16 rounded-full" style={{ background: color }} />
      <div className="relative">
        <Image src={avatarUrl} alt={p.username} width={72} height={72} className="rounded-xl" unoptimized />
        {p.isOnline && (
          <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" />
        )}
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {p.title && <Badge variant="warning">{p.title}</Badge>}
          <h3 className="text-lg font-bold text-foreground">{p.displayName}</h3>
        </div>
        <p className="text-sm text-muted">@{p.username}</p>
      </div>
      <Badge variant={p.platform === "chesscom" ? "chesscom" : "lichess"}>
        {p.platform === "chesscom" ? "Chess.com" : "Lichess"}
      </Badge>
      <div className="grid grid-cols-2 gap-2 w-full text-xs">
        <div className="rounded-lg bg-surface-alt p-2">
          <div className="text-subtle">{t.gamesPlayed}</div>
          <div className="font-bold text-foreground">{formatNumber(total)}</div>
        </div>
        <div className="rounded-lg bg-surface-alt p-2">
          <div className="text-subtle">{t.winRate}</div>
          <div className="font-bold text-success">{wr}%</div>
        </div>
        {p.country && (
          <div className="rounded-lg bg-surface-alt p-2 col-span-2">
            <div className="text-subtle">🌍 {p.country}</div>
          </div>
        )}
        {p.joinedAt && (
          <div className="rounded-lg bg-surface-alt p-2 col-span-2">
            <div className="text-subtle">{t.memberSince} {formatDate(p.joinedAt)}</div>
          </div>
        )}
      </div>
      <a
        href={p.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted hover:text-foreground transition-colors"
      >
        {t.profileLink}
      </a>
    </div>
  )
}

export function CompareProfileCards({ a, b }: Props) {
  const { t } = useT()
  return (
    <div className="flex items-stretch gap-4">
      <MiniProfile data={a} color="#3b82f6" />
      <div className="flex items-center justify-center">
        <span className="text-2xl font-bold text-subtle">{t.vsLabel}</span>
      </div>
      <MiniProfile data={b} color="#f59e0b" />
    </div>
  )
}
