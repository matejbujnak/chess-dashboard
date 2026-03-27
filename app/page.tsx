import { PlatformSelector } from "@/components/landing/PlatformSelector"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"
import { LandingText } from "@/components/landing/LandingText"
import { FeatureItem } from "@/components/landing/FeatureItem"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Crect x='0' y='0' width='30' height='30'/%3E%3Crect x='30' y='30' width='30' height='30'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-4xl shadow-xl">
            ♔
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Chess Dashboard</h1>
          <LandingText />
        </div>

        <PlatformSelector />

        <div className="grid grid-cols-3 gap-6 text-center">
          <FeatureItem icon="📈" tKey="featureRating" />
          <FeatureItem icon="♟" tKey="featureOpenings" />
          <FeatureItem icon="🔥" tKey="featureHeatmap" />
        </div>
      </div>
    </main>
  )
}
