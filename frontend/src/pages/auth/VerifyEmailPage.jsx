import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '@services/api'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token    = params.get('token')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (token) {
      authAPI.verifyEmail(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'))
    } else {
      setStatus('error')
    }
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 p-6">
      <div className="text-center max-w-md">
        {status === 'loading' && <Loader size={48} className="animate-spin text-primary-500 mx-auto mb-4" />}
        {status === 'success' && (
          <>
            <CheckCircle size={64} className="text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold dark:text-white mb-2">Email Verified!</h2>
            <p className="text-dark-500 mb-6">Your account is now active. You can login.</p>
            <Link to="/login" className="btn-primary btn-lg">Go to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={64} className="text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold dark:text-white mb-2">Verification Failed</h2>
            <p className="text-dark-500 mb-6">Invalid or expired verification link.</p>
            <Link to="/login" className="btn-primary">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  )
}
