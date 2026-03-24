import { create } from 'zustand'
import type { ParsedCV, MatchResult } from '@/lib/api'

export type Step = 'upload' | 'job' | 'result'

interface AppState {
  step: Step
  parsedCV: ParsedCV | null
  matchResult: MatchResult | null
  jobDescription: string
  fileName: string
  analysisText: string
  isAnalyzing: boolean
  error: string | null

  setStep: (s: Step) => void
  setParsedCV: (cv: ParsedCV, fileName: string) => void
  setMatchResult: (r: MatchResult) => void
  setJobDescription: (j: string) => void
  appendAnalysis: (text: string) => void
  setIsAnalyzing: (v: boolean) => void
  setError: (e: string | null) => void
  reset: () => void
}

export const useStore = create<AppState>((set) => ({
  step: 'upload',
  parsedCV: null,
  matchResult: null,
  jobDescription: '',
  fileName: '',
  analysisText: '',
  isAnalyzing: false,
  error: null,

  setStep: (step) => set({ step }),
  setParsedCV: (parsedCV, fileName) => set({ parsedCV, fileName }),
  setMatchResult: (matchResult) => set({ matchResult }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  appendAnalysis: (text) => set((s) => ({ analysisText: s.analysisText + text })),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      step: 'upload',
      parsedCV: null,
      matchResult: null,
      jobDescription: '',
      fileName: '',
      analysisText: '',
      isAnalyzing: false,
      error: null,
    }),
}))
