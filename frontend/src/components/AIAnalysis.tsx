import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { streamAnalysis } from '@/lib/api'
import { useStore } from '@/store/useStore'
import type { MatchResult } from '@/lib/api'

interface Props {
  match: MatchResult
  jobDescription: string
}

export default function AIAnalysis({ match, jobDescription }: Props) {
  const { analysisText, appendAnalysis, setIsAnalyzing, isAnalyzing } = useStore()
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const ctrlRef = useRef<AbortController | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (started || analysisText) return
    setStarted(true)
    setIsAnalyzing(true)
    setError(null)

    ctrlRef.current = streamAnalysis(
      {
        cv_skills: match.cv_skills,
        job_skills: match.job_skills,
        missing_skills: match.missing_skills,
        matched_skills: match.matched_skills,
        job_description: jobDescription,
        score: match.score,
      },
      (text) => appendAnalysis(text),
      () => setIsAnalyzing(false),
      (err) => { setError(err); setIsAnalyzing(false) }
    )
    return () => ctrlRef.current?.abort()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [analysisText])

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.699-1.42 2.415l-2.08-.416A5 5 0 0012 21a5 5 0 00-4.702-3.299l-2.08.416c-1.45.284-2.42-1.416-1.42-2.415L5 14.5" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-syne font-semibold text-white">AI Career Analysis</p>
          <p className="text-xs text-white/40 font-mono">Powered by Groq · Llama 3 70B</p>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-1.5 text-xs text-violet-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Generating…
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-4">
          {error}
        </div>
      )}

      {!analysisText && !error && isAnalyzing && (
        <div className="space-y-2">
          {[80, 60, 90, 50, 70].map((w, i) => (
            <div key={i} className="loading-skeleton h-4 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {analysisText && (
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {analysisText}
          </ReactMarkdown>
          {isAnalyzing && (
            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-blink" />
          )}
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
