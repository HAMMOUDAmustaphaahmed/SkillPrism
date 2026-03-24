import { useState } from 'react'
import { matchJob } from '@/lib/api'
import { useStore } from '@/store/useStore'

const EXAMPLE_JD = `Senior Full Stack Engineer — FinTech Scale-up

We're looking for a passionate Full Stack Engineer to join our growing team.

Requirements:
• 4+ years with React, TypeScript, and modern frontend tooling
• Strong proficiency in Node.js or Python backend development
• Experience with PostgreSQL and Redis
• Familiarity with Docker, Kubernetes, and CI/CD pipelines (GitHub Actions)
• Knowledge of REST APIs and GraphQL
• AWS or GCP cloud experience
• Understanding of microservices architecture

Nice to have:
• Experience with WebSockets or real-time systems
• Machine learning fundamentals
• Agile/Scrum methodology

We offer a fully remote position with competitive equity.`

export default function JobInput() {
  const { parsedCV, jobDescription, setJobDescription, setMatchResult, setStep, setError, fileName } = useStore()
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(jobDescription.length)

  const handleChange = (v: string) => {
    setJobDescription(v)
    setCharCount(v.length)
  }

  const handleSubmit = async () => {
    if (!jobDescription.trim() || !parsedCV) return
    setError(null)
    setLoading(true)
    try {
      const result = await matchJob(parsedCV.raw_text, jobDescription)
      setMatchResult(result)
      setStep('result')
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-xs font-mono text-violet-400 mb-2">Step 02 / 03</p>
          <h2 className="font-syne font-bold text-4xl sm:text-5xl text-white mb-3">
            Paste the job offer
          </h2>
          <p className="text-white/40 text-base">
            The more detail, the sharper the analysis. Full descriptions work best.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* CV summary sidebar */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="glass-card p-5 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/40 font-mono">CV Loaded</p>
                  <p className="text-sm font-medium text-white truncate">{fileName}</p>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-bg-elevated rounded-lg p-3 text-center">
                  <p className="text-lg font-syne font-bold text-white">{parsedCV?.skills.length ?? 0}</p>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">skills found</p>
                </div>
                <div className="flex-1 bg-bg-elevated rounded-lg p-3 text-center">
                  <p className="text-lg font-syne font-bold text-white">{parsedCV?.word_count ?? 0}</p>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">words</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-white/40 font-mono mb-2">Top skills detected</p>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {(parsedCV?.skills ?? []).slice(0, 18).map((skill, i) => (
                    <span
                      key={skill}
                      className="skill-tag-neutral text-[10px] px-2 py-0.5 animate-tag-pop"
                      style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both', opacity: 0 }}
                    >
                      {skill}
                    </span>
                  ))}
                  {(parsedCV?.skills.length ?? 0) > 18 && (
                    <span className="text-[10px] text-white/30 font-mono px-2 py-0.5">
                      +{(parsedCV?.skills.length ?? 0) - 18} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job description input */}
          <div className="lg:col-span-2 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            <div className="gradient-border flex-1">
              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Paste the full job description here…&#10;&#10;Include requirements, responsibilities, and nice-to-haves for the most accurate analysis."
                  className="input-field rounded-2xl min-h-[400px] resize-none text-sm leading-relaxed font-body"
                  spellCheck={false}
                />
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/20">
                  {charCount} chars
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleChange(EXAMPLE_JD)}
                className="btn-ghost text-xs flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Try example JD
              </button>

              <div className="flex-1" />

              <button
                onClick={handleSubmit}
                disabled={!jobDescription.trim() || loading}
                className="btn-primary min-w-[160px]"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Matching…
                  </>
                ) : (
                  <>
                    Analyze match
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {useStore.getState().error && (
              <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {useStore.getState().error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
