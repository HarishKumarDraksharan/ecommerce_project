import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, Tag, ArrowRight, AlertCircle } from 'lucide-react'
import { useCart } from '@context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

function CartItemRow({ item, onUpdate, onRemove }) {
  const [updating, setUpdating] = useState(false)

  const handleQty = async (delta) => {
    setUpdating(true)
    await onUpdate(item.id, item.quantity + delta)
    setUpdating(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 py-4 border-b border-dark-100 dark:border-dark-700 last:border-0"
    >
      <Link to={`/products/${item.product?.slug}`} className="flex-shrink-0">
        <img src={item.product?.thumbnailUrl || '/placeholder.jpg'} alt={item.product?.name}
          className="w-20 h-20 object-cover rounded-xl bg-dark-100" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.product?.slug}`}
          className="font-semibold text-sm text-dark-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-2">
          {item.product?.name}
        </Link>
        {item.product?.brand && (
          <p className="text-xs text-dark-400 mt-0.5">{item.product.brand}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-dark-200 dark:border-dark-600 rounded-lg overflow-hidden">
            <button onClick={() => handleQty(-1)} disabled={updating || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors disabled:opacity-40">
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-bold">
              {updating ? '...' : item.quantity}
            </span>
            <button onClick={() => handleQty(1)} disabled={updating}
              className="w-8 h-8 flex items-center justify-center hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors disabled:opacity-40">
              <Plus size={13} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-black text-base dark:text-white">
              ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
            </span>
            <button onClick={() => onRemove(item.id)}
              className="text-dark-400 hover:text-error transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, summary, loading, updateQuantity, removeFromCart, applyCoupon, removeCoupon } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const items = cart?.items || []

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    await applyCoupon(couponInput.toUpperCase())
    setCouponLoading(false)
  }

  if (loading) return (
    <div className="container-custom py-20 text-center">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  )

  if (items.length === 0) return (
    <div className="container-custom py-20 text-center">
      <div className="w-24 h-24 bg-dark-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={40} className="text-dark-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2 dark:text-white">Your cart is empty</h2>
      <p className="text-dark-500 mb-8">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn-primary btn-lg">
        Continue Shopping
        <ArrowRight size={18} />
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <div className="container-custom py-8">
        <h1 className="text-2xl md:text-3xl font-black dark:text-white mb-6">
          Shopping Cart <span className="text-dark-400 text-lg font-normal">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Cart Items ─────────────────────────────────── */}
          <div className="lg:col-span-2 card p-4">
            <AnimatePresence>
              {items.map(item => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdate={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary ──────────────────────────────── */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-primary-500" />
                <h3 className="font-semibold dark:text-white">Promo Code</h3>
              </div>
              {summary?.couponCode ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div>
                    <span className="badge badge-success">{summary.couponCode}</span>
                    <p className="text-xs text-success mt-1">-₹{summary.couponDiscount?.toLocaleString('en-IN')} saved!</p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-error hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="Enter coupon code"
                    className="input flex-1 text-sm uppercase tracking-wider"
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput}
                    className="btn-primary btn-sm px-4 disabled:opacity-50">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {['WELCOME10', 'FLAT100', 'SAVE20'].map(c => (
                  <button key={c} onClick={() => { setCouponInput(c); }}
                    className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-primary-300 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-mono">
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Card */}
            <div className="card p-5">
              <h3 className="font-bold text-lg dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-500 dark:text-dark-400">Subtotal</span>
                  <span className="font-medium dark:text-white">₹{summary?.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {summary?.couponDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-₹{summary.couponDiscount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-dark-500 dark:text-dark-400">Shipping</span>
                  <span className="font-medium dark:text-white">
                    {summary?.shippingCharge === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : `₹${summary?.shippingCharge?.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-500 dark:text-dark-400">GST (18%)</span>
                  <span className="font-medium dark:text-white">₹{summary?.taxAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between">
                  <span className="font-bold text-base dark:text-white">Total</span>
                  <span className="font-black text-xl text-primary-600 dark:text-primary-400">
                    ₹{summary?.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {summary?.shippingCharge > 0 && (
                <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-600 dark:text-blue-400">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Add ₹{(999 - summary.subtotal)?.toFixed(0)} more for FREE shipping!</span>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full btn-lg text-base mt-5"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <Link to="/products" className="block text-center text-sm text-primary-500 hover:underline mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
