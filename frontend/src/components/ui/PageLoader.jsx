import { Zap } from 'lucide-react'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-dark-950 z-50">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
          <Zap size={32} className="text-white" fill="white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-primary animate-ping opacity-20" />
      </div>
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}
