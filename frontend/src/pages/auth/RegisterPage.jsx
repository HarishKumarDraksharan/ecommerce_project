import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, Zap, Lock, Mail, User, Phone, ArrowRight, Loader, CheckCircle } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import toast from 'react-hot-toast'

const schema = yup.object({
  firstName: yup.string().min(2).required('First name is required'),
  lastName:  yup.string().min(2).required('Last name is required'),
  email:     yup.string().email('Invalid email').required('Email is required'),
  phone:     yup.string().min(10).max(15),
  password:  yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

export default function RegisterPage() {
  const [showPwd, setShowPwd]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const { register: authRegister } = useAuth()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await authRegister({
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        password:  data.password,
      })
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-success" />
          </div>
          <h2 className="text-2xl font-black dark:text-white mb-2">Check Your Email!</h2>
          <p className="text-dark-500 mb-6">
            We&apos;ve sent a verification link to your email address. Click the link to activate your account.
          </p>
          <Link to="/login" className="btn-primary btn-lg">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 to-primary-600
                      flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Zap size={40} className="text-white" fill="white" />
          </div>
          <h2 className="text-4xl font-black font-display mb-4">Join ShopSphere!</h2>
          <p className="text-white/80 text-lg max-w-xs">
            Create an account and start enjoying exclusive deals, faster checkout, and personalized experience.
          </p>
          <div className="mt-8 p-6 bg-white/10 rounded-2xl">
            <p className="text-2xl font-black mb-2">10% OFF</p>
            <p className="text-white/80">Use code <span className="font-mono font-bold">WELCOME10</span> on your first order!</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-dark-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-black text-xl font-display dark:text-white">Shop<span className="gradient-text">Sphere</span></span>
          </Link>

          <h1 className="text-3xl font-black dark:text-white mb-2">Create Account</h1>
          <p className="text-dark-500 dark:text-dark-400 mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-dark-400" />
                  <input placeholder="John" className={`input pl-9 ${errors.firstName ? 'input-error' : ''}`} {...register('firstName')} />
                </div>
                {errors.firstName && <p className="error-msg">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="label">Last Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-dark-400" />
                  <input placeholder="Doe" className={`input pl-9 ${errors.lastName ? 'input-error' : ''}`} {...register('lastName')} />
                </div>
                {errors.lastName && <p className="error-msg">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-dark-400" />
                <input type="email" placeholder="you@example.com" className={`input pl-9 ${errors.email ? 'input-error' : ''}`} {...register('email')} />
              </div>
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Phone (optional)</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-3 text-dark-400" />
                <input type="tel" placeholder="9876543210" className={`input pl-9 ${errors.phone ? 'input-error' : ''}`} {...register('phone')} />
              </div>
              {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-dark-400" />
                <input type={showPwd ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`} {...register('password')} />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-3 text-dark-400">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-dark-400" />
                <input type="password" placeholder="Re-enter your password"
                  className={`input pl-9 ${errors.confirmPassword ? 'input-error' : ''}`} {...register('confirmPassword')} />
              </div>
              {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full btn-lg text-base mt-2">
              {isSubmitting ? <Loader size={20} className="animate-spin" /> : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>

            <p className="text-xs text-center text-dark-400 mt-2">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-500 hover:underline">Terms of Service</a>{' '}
              and <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
