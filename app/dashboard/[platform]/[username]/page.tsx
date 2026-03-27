import { DashboardClient } from "@/components/dashboard/DashboardClient"
import { ThemeToggle } from "@/components/ThemeToggle"

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <span className="text-xl">♔</span>
            <span className="font-semibold">Chess Dashboard</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>{platformLabel}</span>
              <span className="text-border">·</span>
              <span className="font-medium text-foreground">
                {platform === "both"
                  ? `${chesscomUsername} & ${lichessUsername}`
                  : decodeURIComponent(username)}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

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
