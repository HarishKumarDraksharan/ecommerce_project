import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 p-6">
      <div className="text-center max-w-lg">
        <div className="text-9xl font-black gradient-text mb-4">404</div>
        <h1 className="text-3xl font-bold dark:text-white mb-3">Page Not Found</h1>
        <p className="text-dark-500 dark:text-dark-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => window.history.back()} className="btn-secondary gap-2">
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/home" className="btn-primary gap-2">
            <Home size={16} /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
