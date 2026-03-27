"use client"

import { useDashboardData, useBothDashboardData } from "@/hooks/useDashboardData"
import { ProfileCard } from "./ProfileCard"
import { RatingsOverview } from "./RatingsOverview"
import { RatingHistoryChart } from "./RatingHistoryChart"
import { WinLossChart } from "./WinLossChart"
import { OpeningsChart } from "./OpeningsChart"
import { ActivityHeatmap } from "./ActivityHeatmap"
import { AccuracyChart } from "./AccuracyChart"
import { BestWins } from "./BestWins"
import { StatsCards } from "./StatsCards"
import { TimeControlBreakdown } from "./TimeControlBreakdown"
import { ColorStats } from "./ColorStats"
import { GamesPerMonth } from "./GamesPerMonth"
import { FormChart } from "./FormChart"
import { TerminationChart } from "./TerminationChart"
import { OpponentRatingHistogram } from "./OpponentRatingHistogram"
import { Skeleton } from "@/components/ui/skeleton"
import { useT } from "@/components/LanguageProvider"
import type { DashboardData } from "@/lib/unified/types"

interface Props {
  platform: string
  username: string
  chesscomUsername?: string
  lichessUsername?: string
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}

function DashboardContent({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <ProfileCard player={data.player} />
      <StatsCards data={data} />
      <RatingsOverview ratings={data.ratings} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RatingHistoryChart ratingHistory={data.ratingHistory} />
        <WinLossChart games={data.games} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TimeControlBreakdown games={data.games} />
        <AccuracyChart games={data.games} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ColorStats games={data.games} />
        <TerminationChart games={data.games} />
      </div>

      <FormChart games={data.games} />
      <GamesPerMonth games={data.games} />

      <div className="grid gap-6 lg:grid-cols-2">
        <OpponentRatingHistogram games={data.games} />
        <BestWins bestWins={data.bestWins} />
      </div>

      <OpeningsChart openings={data.openings} />
      <ActivityHeatmap heatmap={data.heatmap} />
    </div>
  )
}

function SinglePlatformDashboard({ platform, username }: { platform: string; username: string }) {
  const { data, error, isLoading } = useDashboardData(platform, username)
  const { t } = useT()

  if (isLoading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/10 p-8 text-center">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-semibold text-foreground">{t.playerNotFound}</h3>
        <p className="text-sm text-muted">{error.message}</p>
        <a href="/" className="mt-2 text-sm text-[#3b82f6] hover:underline">{t.back}</a>
      </div>
    )
  }

  if (!data) return null

  return <DashboardContent data={data} />
}

function BothPlatformsDashboard({ chesscomUsername, lichessUsername }: { chesscomUsername: string; lichessUsername: string }) {
  const { chesscom, lichess } = useBothDashboardData(chesscomUsername, lichessUsername)

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#7fa650]" />
          <h2 className="text-lg font-bold text-foreground">Chess.com — {chesscomUsername}</h2>
        </div>
        {chesscom.isLoading && <LoadingSkeleton />}
        {chesscom.error && (
          <p className="text-sm text-danger">Chyba: {chesscom.error.message}</p>
        )}
        {chesscom.data && <DashboardContent data={chesscom.data} />}
      </section>

      <div className="border-t border-border" />

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#b58863]" />
          <h2 className="text-lg font-bold text-foreground">Lichess — {lichessUsername}</h2>
        </div>
        {lichess.isLoading && <LoadingSkeleton />}
        {lichess.error && (
          <p className="text-sm text-danger">Chyba: {lichess.error.message}</p>
        )}
        {lichess.data && <DashboardContent data={lichess.data} />}
      </section>
    </div>
  )
}

export function DashboardClient({ platform, username, chesscomUsername, lichessUsername }: Props) {
  if (platform === "both" && chesscomUsername && lichessUsername) {
    return <BothPlatformsDashboard chesscomUsername={chesscomUsername} lichessUsername={lichessUsername} />
  }
  return <SinglePlatformDashboard platform={platform} username={username} />
}
