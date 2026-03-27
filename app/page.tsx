import { PlatformSelector } from "@/components/landing/PlatformSelector"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0f1117] px-4">
      {/* Background chess pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Crect x='0' y='0' width='30' height='30'/%3E%3Crect x='30' y='30' width='30' height='30'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2d3748] bg-[#1a1f2e] text-4xl shadow-xl">
            ♔
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Chess Dashboard
          </h1>
          <p className="max-w-sm text-[#a0aec0]">
            Analyzuj svoju šachovú históriu z Chess.com alebo Lichess. Grafy, štatistiky, otvárania — všetko na jednom mieste.
          </p>
        </div>

        <PlatformSelector />

        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { icon: "📈", label: "Rating história" },
            { icon: "♟", label: "Otvárania" },
            { icon: "🔥", label: "Aktivity mapa" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-xs text-[#4a5568]">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
