import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import ScoreRing from '@/components/ScoreRing'
import SkillsBreakdown from '@/components/SkillsBreakdown'
import AIAnalysis from '@/components/AIAnalysis'

export default function Result() {
  const { matchResult, jobDescription, parsedCV, reset, fileName } = useStore()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  if (!matchResult) return null

  const cvOnly = matchResult.cv_skills.filter(
    (s) => !matchResult.matched_skills.includes(s) && !matchResult.missing_skills.includes(s)
  )

  const stats = [
    { label: 'Skills in CV', value: matchResult.cv_skills.length, color: 'text-violet-400' },
    { label: 'Matched', value: matchResult.matched_skills.length, color: 'text-emerald-400' },
    { label: 'Missing', value: matchResult.missing_skills.length, color: 'text-rose-400' },
    { label: 'Bonus', value: cvOnly.length, color: 'text-cyan-400' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-xs font-mono text-violet-400 mb-1">Step 03 / 03 — Results</p>
            <h2 className="font-syne font-bold text-3xl sm:text-4xl text-white">Your match report</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { useStore.getState().setStep('job') }}
              className="btn-ghost text-xs"
            >
              ← Edit job offer
            </button>
            <button onClick={reset} className="btn-ghost text-xs">
              Start over
            </button>
          </div>
        </div>

        {/* Score hero */}
        <div className="gradient-border mb-6 animate-slide-up" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
          <div className="p-8 flex flex-col sm:flex-row items-center gap-8">
            <ScoreRing
              score={matchResult.score}
              label={matchResult.label}
              color={matchResult.color}
              size={180}
            />

            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-white/50 text-sm font-mono">{fileName}</p>
                <span className="text-white/20">→</span>
                <p className="text-white/50 text-sm font-mono truncate max-w-[240px]">
                  {jobDescription.split('\n')[0].slice(0, 50)}…
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {stats.map((s) => (
                  <div key={s.label} className="bg-bg-elevated rounded-xl p-3 text-center">
                    <p className={`text-2xl font-syne font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-white/35 font-mono mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Match bar */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-white/30 mb-1.5">
                  <span>Match coverage</span>
                  <span>{matchResult.score}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${matchResult.score}%`,
                      background: `linear-gradient(90deg, #7c3aed, ${matchResult.color})`,
                      boxShadow: `0 0 12px ${matchResult.color}60`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Skills breakdown — 2 cols */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <SkillsBreakdown
              matchedSkills={matchResult.matched_skills}
              missingSkills={matchResult.missing_skills}
              cvOnlySkills={cvOnly}
              skillsByCategory={matchResult.skills_by_category}
            />
          </div>

          {/* AI analysis — 3 cols */}
          <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            <AIAnalysis match={matchResult} jobDescription={jobDescription} />
          </div>
        </div>

        {/* CTA footer */}
        <div className="mt-10 text-center animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <p className="text-white/30 text-sm mb-4">Analyze another position with the same CV</p>
          <button
            onClick={() => useStore.getState().setStep('job')}
            className="btn-primary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try another job offer
          </button>
        </div>
      </div>
    </div>
  )
}
