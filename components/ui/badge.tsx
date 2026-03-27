import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "chesscom" | "lichess" | "success" | "warning" | "muted"
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30",
    chesscom: "bg-[#7fa650]/20 text-[#7fa650] border border-[#7fa650]/30",
    lichess: "bg-[#b58863]/20 text-[#b58863] border border-[#b58863]/30",
    success: "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30",
    warning: "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30",
    muted: "bg-[#2d3748] text-[#a0aec0] border border-[#4a5568]",
  }

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
