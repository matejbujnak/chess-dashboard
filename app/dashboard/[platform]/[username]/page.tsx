import { DashboardClient } from "@/components/dashboard/DashboardClient"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { CopyLinkButton } from "@/components/CopyLinkButton"
import { TimeControlFilter } from "@/components/TimeControlFilter"
import { Suspense } from "react"

interface Props {
  params: Promise<{ platform: string; username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { platform, username } = await params
  const displayName = platform === "both" ? username.replace("--", " & ") : username
  return {
    title: `${displayName} — Chess Dashboard`,
    description: `Chess statistics for ${displayName}`,
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

  const displayUsername =
    platform === "both"
      ? `${chesscomUsername} & ${lichessUsername}`
      : decodeURIComponent(username)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <span className="text-xl">♔</span>
            <span className="font-semibold">Chess Dashboard</span>
          </a>
          <div className="flex items-center gap-3">
            <DashboardHeader platform={platform} displayUsername={displayUsername} />
            <Suspense fallback={<div className="w-24 h-8 bg-surface rounded-lg animate-pulse" />}>
              <TimeControlFilter />
            </Suspense>
            <div className="hidden sm:flex items-center gap-2">
              <CopyLinkButton />
              <LanguageToggle />
              <ThemeToggle />
            </div>
            {/* Mobile menu could be here, but for now just show icons */}
            <div className="flex sm:hidden items-center gap-2">
              <CopyLinkButton />
              <LanguageToggle />
              <ThemeToggle />
            </div>
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
