import { useStore } from '@/store/useStore'

export default function Navbar() {
  const { step, reset } = useStore()
  const steps: Array<{ id: typeof step; label: string }> = [
    { id: 'upload', label: 'Upload CV' },
    { id: 'job',    label: 'Job Offer' },
    { id: 'result', label: 'Analysis' },
  ]
  const stepIndex = steps.findIndex((s) => s.id === step)

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16">
      <div
        className="h-full border-b border-white/5"
        style={{ background: 'rgba(3,3,8,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">

          {/* Logo */}
          <button onClick={reset} className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" className="w-8 h-8 transition-transform duration-500 group-hover:rotate-12">
                <defs>
                  <linearGradient id="logoG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="50%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
                <polygon points="16,2 30,28 2,28" fill="url(#logoG)" opacity="0.9"/>
                <polygon points="16,8 26,26 6,26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              </svg>
            </div>
            <span className="font-syne font-bold text-lg gradient-text">SkillPrism</span>
          </button>

          {/* Step indicator */}
          <nav className="flex items-center gap-1">
            {steps.map((s, i) => {
              const done = i < stepIndex
              const active = i === stepIndex
              return (
                <div key={s.id} className="flex items-center gap-1">
                  <div className={[
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs font-mono',
                    active
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : done
                      ? 'text-emerald-400'
                      : 'text-white/30',
                  ].join(' ')}>
                    {done ? (
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? 'bg-violet-500/50' : 'bg-white/10'}`}>
                        {i + 1}
                      </span>
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-px transition-colors duration-500 ${done ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                  )}
                </div>
              )
            })}
          </nav>

          {/* Reset */}
          {step !== 'upload' && (
            <button onClick={reset} className="btn-ghost text-xs py-1.5 px-3">
              Start over
            </button>
          )}
          {step === 'upload' && <div className="w-24" />}
        </div>
      </div>
    </header>
  )
}
