export type Platform = "chesscom" | "lichess"
export type TimeControl = "bullet" | "blitz" | "rapid" | "classical" | "daily" | "puzzle" | "correspondence"

export interface UnifiedPlayer {
  username: string
  displayName: string
  avatarUrl: string | null
  country: string | null
  joinedAt: Date | null
  lastOnlineAt: Date | null
  isOnline: boolean
  title: string | null
  platform: Platform
  profileUrl: string
  followers?: number
}

export interface UnifiedRating {
  timeControl: TimeControl
  label: string
  current: number
  best: number | null
  wins: number
  losses: number
  draws: number
  total: number
}

export interface UnifiedGame {
  id: string
  platform: Platform
  playedAt: Date
  timeControl: string
  timeClass: TimeControl
  userColor: "white" | "black"
  result: "win" | "loss" | "draw"
  termination: string | null
  opponentUsername: string
  opponentRating: number
  userRating: number
  openingEco: string | null
  openingName: string | null
  accuracy: number | null
}

export interface UnifiedRatingPoint {
  date: Date
  rating: number
  timeControl: TimeControl
}

export interface OpeningStat {
  eco: string
  name: string
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export interface HeatmapCell {
  day: number   // 0=Mon ... 6=Sun
  hour: number  // 0-23
  count: number
}

export interface BestWin {
  opponentUsername: string
  opponentRating: number
  result: "win"
  timeClass: TimeControl
  playedAt: Date
  platform: Platform
  gameId: string
}

export interface DashboardData {
  player: UnifiedPlayer
  ratings: UnifiedRating[]
  ratingHistory: UnifiedRatingPoint[]
  games: UnifiedGame[]
  openings: OpeningStat[]
  heatmap: HeatmapCell[]
  bestWins: BestWin[]
  streaks: {
    currentWin: number
    currentUnbeaten: number
  }
}
