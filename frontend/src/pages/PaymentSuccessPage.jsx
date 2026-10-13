import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Home, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@context/CartContext'

export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')
  const { fetchCart } = useCart()

  // Refresh cart state to ensure it is cleared
  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-dark-50 dark:bg-dark-950 py-12 px-4">
      <div className="card max-w-md w-full p-8 text-center bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-card">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
          <CheckCircle size={44} className="text-success" />
        </div>

        <h1 className="text-3xl font-black font-display dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mb-6 leading-relaxed">
          Thank you for your purchase. Your payment was processed successfully, and your order is now confirmed.
        </p>

        {orderId && (
          <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl mb-8">
            <span className="text-xs text-dark-400 dark:text-dark-500 block uppercase tracking-wider font-semibold">Order ID</span>
            <span className="font-mono text-sm font-bold text-dark-800 dark:text-dark-100 block mt-1">
              #{orderId}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/home" className="flex-1 btn btn-secondary text-sm py-3 justify-center gap-1.5">
            <Home size={16} /> Home
          </Link>
          <Link to="/orders" className="flex-1 btn btn-primary text-sm py-3 justify-center gap-1.5 shadow-glow">
            View Orders <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
