import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, Zap, Lock, Mail, ArrowRight, Loader } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import toast from 'react-hot-toast'

const schema = yup.object({
  email:    yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password too short').required('Password is required'),
})

export default function LoginPage() {
  const [showPwd, setShowPwd]   = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()
  const location                = useLocation()
  const from = location.state?.from?.pathname || '/home'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back! 👋')
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel (hidden on mobile) ──────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-accent-600
                      flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Zap size={40} className="text-white" fill="white" />
          </div>
          <h2 className="text-4xl font-black font-display mb-4">Welcome Back!</h2>
          <p className="text-white/80 text-lg max-w-xs">
            Sign in to access your cart, orders, and personalized recommendations.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {['🛒 Access your saved cart', '📦 Track your orders', '❤️ View your wishlist', '🎁 Exclusive member deals'].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ──────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-dark-950">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-black text-xl font-display dark:text-white">Shop<span className="gradient-text">Sphere</span></span>
          </Link>

          <h1 className="text-3xl font-black dark:text-white mb-2">Sign In</h1>
          <p className="text-dark-500 dark:text-dark-400 mb-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:underline">Sign up</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-dark-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-dark-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-3 text-dark-400 hover:text-dark-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full btn-lg text-base mt-2">
              {isSubmitting ? <Loader size={20} className="animate-spin" /> : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
            <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-2 uppercase tracking-wide">Demo Accounts</p>
            <div className="space-y-1 text-xs">
              <p className="text-dark-600 dark:text-dark-300">👤 Customer: <span className="font-mono">john.doe@example.com</span> / <span className="font-mono">User@123</span></p>
              <p className="text-dark-600 dark:text-dark-300">⚙️ Admin: <span className="font-mono">admin@shopsphere.com</span> / <span className="font-mono">Admin@123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
