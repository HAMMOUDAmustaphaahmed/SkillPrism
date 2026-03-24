import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  matchedSkills: string[]
  missingSkills: string[]
  cvOnlySkills: string[]
  skillsByCategory: Record<string, string[]>
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-white/70">{payload[0].name}</p>
        <p className="text-violet-400 font-mono font-bold">{Math.round(payload[0].value)}%</p>
      </div>
    )
  }
  return null
}

export default function SkillsBreakdown({ matchedSkills, missingSkills, cvOnlySkills, skillsByCategory }: Props) {
  const categories = Object.keys(skillsByCategory)

  const radarData = categories.slice(0, 7).map((cat) => {
    const catSkills = skillsByCategory[cat]
    const matched = catSkills.filter((s) => matchedSkills.includes(s)).length
    const total = catSkills.length
    return {
      category: cat,
      score: total > 0 ? Math.round((matched / total) * 100) : 0,
    }
  })

  return (
    <div className="flex flex-col gap-6">

      {/* Radar chart */}
      {radarData.length >= 3 && (
        <div className="glass-card p-5">
          <p className="text-xs font-mono text-white/40 mb-4">Skills coverage by category</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
              <Radar
                name="Match"
                dataKey="score"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Matched */}
      {matchedSkills.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-mono text-white/40">Matched skills</p>
            <span className="ml-auto text-xs font-mono text-emerald-400">{matchedSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((s, i) => (
              <span
                key={s}
                className="skill-tag-matched animate-tag-pop"
                style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'both', opacity: 0 }}
              >
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3"/>
                </svg>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing */}
      {missingSkills.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <p className="text-xs font-mono text-white/40">Skills to develop</p>
            <span className="ml-auto text-xs font-mono text-rose-400">{missingSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((s, i) => (
              <span
                key={s}
                className="skill-tag-missing animate-tag-pop"
                style={{ animationDelay: `${i * 0.03}s`, animationFillMode: 'both', opacity: 0 }}
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M4 1v6M1 4h6" strokeLinecap="round"/>
                </svg>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CV extras */}
      {cvOnlySkills.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <p className="text-xs font-mono text-white/40">Bonus skills (you have, not required)</p>
            <span className="ml-auto text-xs font-mono text-violet-400">{cvOnlySkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cvOnlySkills.slice(0, 20).map((s) => (
              <span key={s} className="skill-tag-neutral text-[10px] px-2 py-0.5">{s}</span>
            ))}
            {cvOnlySkills.length > 20 && (
              <span className="text-[10px] text-white/30 font-mono px-2 py-0.5">+{cvOnlySkills.length - 20}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
