"use client"

import { useMemo } from "react"
import { ActivityCalendarCell } from "@/lib/unified/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useT } from "@/components/LanguageProvider"

interface Props {
  activityCalendar: ActivityCalendarCell[]
}

export function ActivityCalendar({ activityCalendar }: Props) {
  const { t } = useT()
  
  // Calculate bounds: today to 365 days ago
  const { weeks, maxCount } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Create map for fast lookup
    const counts = new Map(activityCalendar.map(c => [c.date, c.count]))
    let maxCount = 0
    activityCalendar.forEach(c => {
      if (c.count > maxCount) maxCount = c.count
    })

    const daysInYear = 365
    const dates: { date: Date; dateStr: string; count: number }[] = []
    
    for (let i = daysInYear; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`
      
      dates.push({
        date: d,
        dateStr,
        count: counts.get(dateStr) ?? 0,
      })
    }

    // Pad beginning to align with Sunday
    const firstDay = dates[0].date.getDay() // 0 = Sunday
    for (let i = 0; i < firstDay; i++) {
       dates.unshift({ date: new Date(0), dateStr: "", count: -1 })
    }

    // Group by weeks (chunk by 7)
    const weeks: typeof dates[] = []
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7))
    }

    return { weeks, maxCount }
  }, [activityCalendar])

  function getLevelClass(count: number) {
    if (count === -1) return "opacity-0" // hidden padding cell
    if (count === 0) return "bg-surface-alt border border-border"
    if (count < 3) return "bg-[#39d353]/30"
    if (count < 8) return "bg-[#39d353]/60"
    if (count < 15) return "bg-[#39d353]/80"
    return "bg-[#39d353]"
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">{t.activityCalendarTitle ?? "Kalendár aktivity"}</h3>
        <p className="text-sm text-muted">{t.activityCalendarDesc ?? "Partie odohrané za posledný rok"}</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          <TooltipProvider delayDuration={100}>
            <div className="flex gap-1 items-end">
              <div className="hidden sm:flex flex-col gap-1 pr-2 mt-4 text-xs text-muted w-8 text-right">
                <div className="h-3 my-0.5">Po</div>
                <div className="h-3 my-0.5" />
                <div className="h-3 my-0.5">St</div>
                <div className="h-3 my-0.5" />
                <div className="h-3 my-0.5">Pi</div>
                <div className="h-3 my-0.5" />
                <div className="h-3 my-0.5" />
              </div>
              
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => (
                    day.count === -1 ? (
                       <div key={dIdx} className="w-3 h-3 md:w-[14px] md:h-[14px] rounded-[2px]" />
                    ) : (
                      <Tooltip key={day.dateStr}>
                        <TooltipTrigger asChild>
                          <div 
                            className={`w-3 h-3 md:w-[14px] md:h-[14px] rounded-[2px] transition-colors hover:ring-1 hover:ring-foreground/50 cursor-pointer ${getLevelClass(day.count)}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs font-semibold">{day.count} {t.games ?? "partií"}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(day.date).toLocaleDateString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  ))}
                </div>
              ))}
            </div>
          </TooltipProvider>

          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted">
            <span>Menej</span>
            <div className={`w-3 h-3 rounded-[2px] ${getLevelClass(0)}`} />
            <div className={`w-3 h-3 rounded-[2px] ${getLevelClass(2)}`} />
            <div className={`w-3 h-3 rounded-[2px] ${getLevelClass(5)}`} />
            <div className={`w-3 h-3 rounded-[2px] ${getLevelClass(10)}`} />
            <div className={`w-3 h-3 rounded-[2px] ${getLevelClass(20)}`} />
            <span>Viac</span>
          </div>
        </div>
      </div>
    </div>
  )
}
