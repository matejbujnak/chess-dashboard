export interface ChessComProfile {
  username: string
  player_id: number
  title?: string
  status: string
  name?: string
  avatar?: string
  location?: string
  country: string
  joined: number
  last_online: number
  followers: number
  is_streamer: boolean
  url: string
}

export interface ChessComStats {
  chess_daily?: ChessComTimeControlStats
  chess_rapid?: ChessComTimeControlStats
  chess_blitz?: ChessComTimeControlStats
  chess_bullet?: ChessComTimeControlStats
  chess_960_daily?: ChessComTimeControlStats
  tactics?: {
    highest: { rating: number; date: number }
    lowest: { rating: number; date: number }
  }
}

export interface ChessComTimeControlStats {
  last: { rating: number; date: number; rd: number }
  best?: { rating: number; date: number; game: string }
  record: { win: number; loss: number; draw: number }
}

export interface ChessComGame {
  url: string
  pgn?: string
  time_control: string
  end_time: number
  rated: boolean
  time_class: string
  rules: string
  white: ChessComGamePlayer
  black: ChessComGamePlayer
  eco?: string
  accuracies?: { white: number; black: number }
  uuid: string
}

export interface ChessComGamePlayer {
  rating: number
  result: string
  "@id": string
  username: string
  uuid: string
}
