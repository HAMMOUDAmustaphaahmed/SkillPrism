import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { parseCV } from '@/lib/api'
import { useStore } from '@/store/useStore'

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
}

export default function CVUpload() {
  const { setParsedCV, setStep, setError } = useStore()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    setError(null)
    setLoading(true)
    setProgress('Reading your CV…')
    try {
      await new Promise((r) => setTimeout(r, 300))
      setProgress('Extracting skills…')
      const result = await parseCV(file)
      setProgress('Done!')
      setParsedCV(result, file.name)
      setTimeout(() => setStep('job'), 400)
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
      setProgress('')
    }
  }, [setParsedCV, setStep, setError])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    onDropAccepted: () => setDragOver(false),
    onDropRejected: () => {
      setDragOver(false)
      setError('Invalid file. Please upload a PDF, DOCX or TXT under 5 MB.')
    },
  })

  const { error } = useStore()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-12">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI-powered career matching
        </div>
        <h1 className="font-syne font-bold text-5xl sm:text-6xl lg:text-7xl mb-4 leading-[1.1]">
          Refract your<br />
          <span className="gradient-text">potential</span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
          Upload your CV — we'll extract every skill and match you to any job with AI precision.
        </p>
      </div>

      {/* Drop zone */}
      <div className="w-full max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div
          {...getRootProps()}
          className={[
            'relative cursor-pointer rounded-2xl p-12 text-center transition-all duration-300 select-none',
            loading ? 'pointer-events-none' : '',
            isDragReject ? 'border-2 border-rose-500/60 bg-rose-500/5' :
            isDragActive || dragOver ? 'border-2 border-violet-400/60 bg-violet-500/8 scale-[1.01]' :
            'gradient-border',
          ].join(' ')}
        >
          {!loading && <input {...getInputProps()} />}

          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="4"/>
                  <circle
                    cx="32" cy="32" r="28"
                    fill="none"
                    stroke="url(#spinG)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="80 100"
                    className="animate-spin"
                    style={{ transformOrigin: '32px 32px', animationDuration: '1.2s' }}
                  />
                  <defs>
                    <linearGradient id="spinG" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed"/>
                      <stop offset="100%" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-white/60 text-sm font-mono">{progress}</p>
            </div>
          ) : isDragActive && !isDragReject ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="font-syne font-semibold text-violet-300 text-lg">Drop it!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              {/* Prism decoration */}
              <div className="relative">
                <div className="absolute inset-0 bg-glow-violet rounded-full scale-150 opacity-50" />
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 animate-float">
                    <defs>
                      <linearGradient id="prismDG" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed"/>
                        <stop offset="50%" stopColor="#06b6d4"/>
                        <stop offset="100%" stopColor="#10b981"/>
                      </linearGradient>
                    </defs>
                    <polygon points="40,5 75,68 5,68" fill="url(#prismDG)" opacity="0.85"/>
                    <polygon points="40,18 65,62 15,62" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                    <line x1="40" y1="5" x2="5" y2="68" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                    <line x1="40" y1="5" x2="75" y2="68" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                  </svg>
                </div>
              </div>

              <div>
                <p className="font-syne font-bold text-xl text-white mb-1">
                  Drop your CV here
                </p>
                <p className="text-white/40 text-sm">
                  or <span className="text-violet-400 underline underline-offset-2">browse files</span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
                {['PDF', 'DOCX', 'TXT'].map((f) => (
                  <span key={f} className="px-2 py-1 rounded bg-white/5 border border-white/8">{f}</span>
                ))}
                <span className="text-white/20">·</span>
                <span>Max 5 MB</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-3 justify-center mt-10 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        {[
          { icon: '⚡', text: 'Instant skill extraction' },
          { icon: '🎯', text: 'AI job matching' },
          { icon: '📈', text: 'Gap analysis & plan' },
        ].map((f) => (
          <div key={f.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-white/6 text-sm text-white/50">
            <span>{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
