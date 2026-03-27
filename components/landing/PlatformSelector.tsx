"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useT } from "@/components/LanguageProvider"

type Platform = "chesscom" | "lichess" | "both" | "compare"

export function PlatformSelector() {
  const router = useRouter()
  const { t } = useT()
  const [platform, setPlatform] = useState<Platform>("chesscom")
  const [username, setUsername] = useState("")
  const [usernameChesscom, setUsernameChesscom] = useState("")
  const [usernameLichess, setUsernameLichess] = useState("")
  // Compare: two separate players, each with their own platform
  const [compareA, setCompareA] = useState({ platform: "chesscom", username: "" })
  const [compareB, setCompareB] = useState({ platform: "chesscom", username: "" })
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (platform === "both") {
      if (!usernameChesscom || !usernameLichess) return
      router.push(`/dashboard/both/${encodeURIComponent(usernameChesscom)}--${encodeURIComponent(usernameLichess)}`)
    } else if (platform === "compare") {
      if (!compareA.username || !compareB.username) return
      const slugA = compareA.platform === compareB.platform
        ? encodeURIComponent(compareA.username)
        : `${compareA.platform}:${encodeURIComponent(compareA.username)}`
      const slugB = compareA.platform === compareB.platform
        ? encodeURIComponent(compareB.username)
        : `${compareB.platform}:${encodeURIComponent(compareB.username)}`
      const sharedPlatform = compareA.platform === compareB.platform ? compareA.platform : "mixed"
      router.push(`/compare/${sharedPlatform}/${slugA}--${slugB}`)
    } else {
      if (!username) return
      router.push(`/dashboard/${platform}/${encodeURIComponent(username)}`)
    }
  }

  const tabs: { id: Platform; label: string; color: string; icon: string }[] = [
    { id: "chesscom", label: "Chess.com",    color: "#7fa650", icon: "♟" },
    { id: "lichess",  label: "Lichess",      color: "#b58863", icon: "♞" },
    { id: "both",     label: t.bothPlatforms, color: "#3b82f6", icon: "⚡" },
    { id: "compare",  label: t.compare,       color: "#a855f7", icon: "⚔️" },
  ]

  const activeColor = tabs.find((tb) => tb.id === platform)?.color ?? "#3b82f6"

  const PLATFORM_OPTIONS = [
    { value: "chesscom", label: "Chess.com" },
    { value: "lichess",  label: "Lichess" },
  ]

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 grid grid-cols-4 rounded-xl border border-border bg-surface p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPlatform(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-xs font-medium transition-all",
              platform === tab.id ? "bg-background shadow-sm" : "text-muted hover:text-foreground"
            )}
            style={platform === tab.id ? { color: tab.color } : undefined}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className="leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {platform === "both" ? (
          <>
            <div>
              <label className="mb-1.5 block text-sm text-muted">{t.chesscomUsername}</label>
              <input
                type="text"
                value={usernameChesscom}
                onChange={(e) => setUsernameChesscom(e.target.value)}
                placeholder={t.placeholderChesscom}
                className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none focus:border-chesscom transition-colors"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">{t.lichessUsername}</label>
              <input
                type="text"
                value={usernameLichess}
                onChange={(e) => setUsernameLichess(e.target.value)}
                placeholder={t.placeholderLichess}
                className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none focus:border-lichess transition-colors"
                required
              />
            </div>
          </>
        ) : platform === "compare" ? (
          <>
            <div>
              <label className="mb-1.5 block text-sm text-muted">{t.player1}</label>
              <div className="flex gap-2">
                <select
                  value={compareA.platform}
                  onChange={(e) => setCompareA((p) => ({ ...p, platform: e.target.value }))}
                  className="rounded-lg border border-border bg-surface-alt px-2 py-3 text-sm text-foreground outline-none"
                >
                  {PLATFORM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={compareA.username}
                  onChange={(e) => setCompareA((p) => ({ ...p, username: e.target.value }))}
                  placeholder={compareA.platform === "chesscom" ? t.placeholderChesscom : t.placeholderLichess}
                  className="flex-1 rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none transition-colors"
                  required
                />
              </div>
            </div>
            <div className="text-center text-sm font-bold text-subtle">{t.vsLabel}</div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">{t.player2}</label>
              <div className="flex gap-2">
                <select
                  value={compareB.platform}
                  onChange={(e) => setCompareB((p) => ({ ...p, platform: e.target.value }))}
                  className="rounded-lg border border-border bg-surface-alt px-2 py-3 text-sm text-foreground outline-none"
                >
                  {PLATFORM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={compareB.username}
                  onChange={(e) => setCompareB((p) => ({ ...p, username: e.target.value }))}
                  placeholder={compareB.platform === "chesscom" ? t.placeholderChesscom : t.placeholderLichess}
                  className="flex-1 rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1.5 block text-sm text-muted">
              {platform === "chesscom" ? t.chesscomUsername : t.lichessUsername}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={platform === "chesscom" ? t.placeholderChesscom : t.placeholderLichess}
              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none transition-colors"
              onFocus={(e) => (e.target.style.borderColor = activeColor)}
              onBlur={(e) => (e.target.style.borderColor = "")}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)` }}
        >
          {loading ? t.loading : platform === "compare" ? t.showComparison : t.showDashboard}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-subtle">{t.publicData}</p>
    </div>
  )
}
