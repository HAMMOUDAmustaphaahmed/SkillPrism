import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(msg))
  }
)

// ── Keep-alive ping ────────────────────────────────────────────────────────────
// Render free tier sleeps after ~30s of inactivity.
// We ping /health every 20 seconds to prevent cold starts.
let pingInterval: ReturnType<typeof setInterval> | null = null

export function startKeepAlive() {
  if (pingInterval) return
  const ping = async () => {
    try { await api.get('/health') } catch { /* silent */ }
  }
  ping()
  pingInterval = setInterval(ping, 20_000)
}

export function stopKeepAlive() {
  if (pingInterval) { clearInterval(pingInterval); pingInterval = null }
}

// ── API calls ─────────────────────────────────────────────────────────────────
export interface ParsedCV {
  raw_text: string
  skills: string[]
  skills_by_category: Record<string, string[]>
  word_count: number
}

export interface MatchResult {
  score: number
  matched_skills: string[]
  missing_skills: string[]
  cv_skills: string[]
  job_skills: string[]
  skills_by_category: Record<string, string[]>
  label: string
  color: string
}

export async function parseCV(file: File): Promise<ParsedCV> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<ParsedCV>('/api/cv/parse', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60_000,
  })
  return data
}

export async function matchJob(cvText: string, jobDescription: string): Promise<MatchResult> {
  const { data } = await api.post<MatchResult>('/api/jobs/match', {
    cv_text: cvText,
    job_description: jobDescription,
  })
  return data
}

export interface AnalyzePayload {
  cv_skills: string[]
  job_skills: string[]
  missing_skills: string[]
  matched_skills: string[]
  job_description: string
  score: number
}

export function streamAnalysis(
  payload: AnalyzePayload,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void
): AbortController {
  const ctrl = new AbortController()

  ;(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      })
      if (!res.ok) {
        onError(`Server error ${res.status}`)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) { onError('No response stream'); return }
      const decoder = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const payload = JSON.parse(line.slice(6))
            if (payload.done) { onDone(); return }
            if (payload.text) onChunk(payload.text)
          } catch { /* skip malformed */ }
        }
      }
      onDone()
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return
      onError((err as Error).message || 'Stream error')
    }
  })()

  return ctrl
}
