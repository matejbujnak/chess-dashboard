"use client"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatNumber } from "@/lib/utils"
import { useT } from "@/components/LanguageProvider"
import type { UnifiedPlayer } from "@/lib/unified/types"

export function ProfileCard({ player }: { player: UnifiedPlayer }) {
  const { t } = useT()
  const avatarUrl =
    player.avatarUrl ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(player.username)}&background=1a1f2e&color=e2e8f0&size=128&bold=true`

  return (
    <Card className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Image src={avatarUrl} alt={player.username} width={72} height={72} className="rounded-xl" unoptimized />
        {player.isOnline && (
          <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {player.title && <Badge variant="warning">{player.title}</Badge>}
          <h2 className="text-xl font-bold text-foreground truncate">{player.displayName}</h2>
          <Badge variant={player.platform === "chesscom" ? "chesscom" : "lichess"}>
            {player.platform === "chesscom" ? "Chess.com" : "Lichess"}
          </Badge>
        </div>
        <p className="text-sm text-muted">@{player.username}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
          {player.country && <span>🌍 {player.country}</span>}
          {player.joinedAt && <span>📅 {t.memberSince} {formatDate(player.joinedAt)}</span>}
          {player.followers != null && <span>👥 {formatNumber(player.followers)} {t.followers}</span>}
          {player.lastOnlineAt && !player.isOnline && <span>🕐 {t.lastOnline} {formatDate(player.lastOnlineAt)}</span>}
          {player.isOnline && <span className="text-success">● {t.online}</span>}
        </div>
      </div>
      <a href={player.profileUrl} target="_blank" rel="noopener noreferrer"
        className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted transition-colors hover:border-muted hover:text-foreground">
        {t.profileLink}
      </a>
    </Card>
  )
}
