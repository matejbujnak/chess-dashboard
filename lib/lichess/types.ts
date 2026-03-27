export interface LichessUser {
  id: string
  username: string
  title?: string
  online?: boolean
  createdAt: number
  seenAt: number
  profile?: {
    country?: string
    firstName?: string
    lastName?: string
    bio?: string
    links?: string
    fideRating?: number
  }
  url: string
  nbFollowers?: number
  nbFollowing?: number
  completionRate?: number
  count?: {
    all: number
    rated: number
    ai: number
    draw: number
    drawH: number
    loss: number
    lossH: number
    win: number
    winH: number
    bookmark: number
    playing: number
    import: number
    me: number
  }
  perfs: {
    ultraBullet?: LichessPerf
    bullet?: LichessPerf
    blitz?: LichessPerf
    rapid?: LichessPerf
    classical?: LichessPerf
    correspondence?: LichessPerf
    chess960?: LichessPerf
    puzzle?: LichessPerf
  }
  playTime?: { total: number; tv: number }
}

export interface LichessPerf {
  games: number
  rating: number
  rd: number
  prog: number
  prov?: boolean
}

export interface LichessRatingHistoryEntry {
  name: string
  points: [number, number, number, number][] // [year, month0-based, day, rating]
}

export interface LichessGame {
  id: string
  rated: boolean
  variant: string
  speed: string
  perf: string
  createdAt: number
  lastMoveAt: number
  status: string
  players: {
    white: LichessGamePlayer
    black: LichessGamePlayer
  }
  winner?: "white" | "black"
  opening?: {
    eco: string
    name: string
    ply: number
  }
  moves?: string
  clock?: {
    initial: number
    increment: number
    totalTime: number
  }
}

export interface LichessGamePlayer {
  user?: { name: string; id: string; title?: string }
  aiLevel?: number
  rating?: number
  ratingDiff?: number
}
