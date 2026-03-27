"use client"
import { useT } from "@/components/LanguageProvider"

interface Props {
  platform: string
  displayUsername: string
}

export function DashboardHeader({ platform, displayUsername }: Props) {
  const { t } = useT()
  const platformLabel =
    platform === "chesscom" ? t.platformChesscom
    : platform === "lichess" ? t.platformLichess
    : t.platformBoth

  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span>{platformLabel}</span>
      <span className="text-border">·</span>
      <span className="font-medium text-foreground">{displayUsername}</span>
    </div>
  )
}
