import { useEffect, useState } from 'react'

interface ScoreRingProps {
  score: number
  label: string
  color: string
  size?: number
}

export default function ScoreRing({ score, label, color, size = 200 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDash = (animatedScore / 100) * circumference

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(score * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const getGradientId = () => `scoreG_${score}`

  const colorMap: Record<string, { from: string; to: string }> = {
    '#10B981': { from: '#10b981', to: '#34d399' },
    '#34D399': { from: '#34d399', to: '#6ee7b7' },
    '#F59E0B': { from: '#f59e0b', to: '#fbbf24' },
    '#F97316': { from: '#f97316', to: '#fb923c' },
    '#F43F5E': { from: '#f43f5e', to: '#fb7185' },
  }
  const gradient = colorMap[color] ?? { from: color, to: color }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={12}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`url(#${getGradientId()})`}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ filter: `drop-shadow(0 0 8px ${gradient.from}80)`, transition: 'stroke-dasharray 0.05s' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-syne font-bold text-5xl text-white" style={{ color }}>{animatedScore}</span>
          <span className="text-white/40 text-xs font-mono mt-0.5">/ 100</span>
        </div>
      </div>

      <div
        className="px-5 py-1.5 rounded-full text-sm font-syne font-semibold"
        style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
      >
        {label}
      </div>
    </div>
  )
}
