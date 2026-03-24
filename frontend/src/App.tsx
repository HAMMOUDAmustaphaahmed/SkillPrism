import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { startKeepAlive } from '@/lib/api'
import Navbar from '@/components/Navbar'
import CVUpload from '@/pages/CVUpload'
import JobInput from '@/pages/JobInput'
import Result from '@/pages/Result'

export default function App() {
  const { step } = useStore()

  // Keep the Render backend alive — ping every 20s
  useEffect(() => {
    startKeepAlive()
    return () => { /* keep running — intentional */ }
  }, [])

  return (
    <div className="relative">
      <Navbar />

      {/* Page transitions */}
      <div key={step} className="animate-fade-in">
        {step === 'upload' && <CVUpload />}
        {step === 'job'    && <JobInput />}
        {step === 'result' && <Result />}
      </div>
    </div>
  )
}
