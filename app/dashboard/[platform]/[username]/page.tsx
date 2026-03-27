import { DashboardClient } from "@/components/dashboard/DashboardClient"

interface Props {
  params: Promise<{ platform: string; username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { platform, username } = await params
  const displayName = platform === "both" ? username.replace("--", " & ") : username
  return {
    title: `${displayName} — Chess Dashboard`,
    description: `Šachové štatistiky pre ${displayName}`,
  }
}

export default async function DashboardPage({ params }: Props) {
  const { platform, username } = await params

  let chesscomUsername: string | undefined
  let lichessUsername: string | undefined

  if (platform === "both") {
    const parts = username.split("--")
    chesscomUsername = decodeURIComponent(parts[0] ?? "")
    lichessUsername = decodeURIComponent(parts[1] ?? "")
  }

  const platformLabel =
    platform === "chesscom" ? "Chess.com" : platform === "lichess" ? "Lichess" : "Chess.com & Lichess"

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Header */}
      <header className="border-b border-[#2d3748] bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <span className="text-xl">♔</span>
            <span className="font-semibold">Chess Dashboard</span>
          </a>
          <div className="flex items-center gap-3 text-sm text-[#a0aec0]">
            <span>{platformLabel}</span>
            <span className="text-[#2d3748]">·</span>
            <span className="font-medium text-white">
              {platform === "both"
                ? `${chesscomUsername} & ${lichessUsername}`
                : decodeURIComponent(username)}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <DashboardClient
          platform={platform}
          username={platform === "both" ? username : decodeURIComponent(username)}
          chesscomUsername={chesscomUsername}
          lichessUsername={lichessUsername}
        />
      </main>
    </div>
  )
}
