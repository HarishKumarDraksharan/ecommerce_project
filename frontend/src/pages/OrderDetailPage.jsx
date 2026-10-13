import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderAPI } from '@services/api'
import {
  Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowLeft,
  Printer, Download, MapPin, CreditCard, ShieldCheck, Zap, RefreshCw, X
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const { data: orderResponse, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getById(id),
  })

  const cancelMutation = useMutation({
    mutationFn: ({ orderId, reason }) => orderAPI.cancelOrder(orderId, reason),
    onSuccess: () => {
      toast.success('Order cancelled successfully')
      queryClient.invalidateQueries(['order', id])
      setCancelModal(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    }
  })

  const orderData = orderResponse?.data || orderResponse
  const order = orderData?.data || orderData

  if (isLoading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-dark-500">Loading order details...</p>
      </div>
    )
  }

  if (error || !order || !order.id) {
    return (
      <div className="container-custom py-16 text-center max-w-md mx-auto">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-dark-500 mb-6">The order you are looking for does not exist or you do not have permission to view it.</p>
        <Link to="/orders" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>
    )
  }

  // Tracking Steps
  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Order received & confirmed', icon: Clock },
    { key: 'PROCESSING', label: 'Processing', desc: 'Packed & ready for dispatch', icon: Package },
    { key: 'SHIPPED', label: 'In Transit', desc: 'Out for delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Handed over to customer', icon: CheckCircle2 },
  ]

  const statusOrder = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentStatus = order.orderStatus || 'PLACED'
  const isCancelled = currentStatus === 'CANCELLED'
  const currentIdx = statusOrder.indexOf(currentStatus)

  // Print Invoice Action
  const handlePrintInvoice = () => {
    window.print()
  }

  return (
    <div className="container-custom py-8">

      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-dark-100 dark:border-dark-800 print:hidden">
        <div>
          <Link to="/orders" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to All Orders
          </Link>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            Order #{order.orderNumber || order.id}
          </h1>
          <p className="text-xs text-dark-400 mt-0.5">
            Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintInvoice}
            className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Printer size={14} /> Print Invoice
          </button>
          {!isCancelled && currentStatus !== 'DELIVERED' && (
            <button
              onClick={() => setCancelModal(true)}
              className="btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs py-2 px-3"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* ── Order Tracking Timeline ───────────────────────────── */}
      {!isCancelled ? (
        <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 mb-8 shadow-sm print:hidden">
          <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-6 flex items-center gap-2">
            <Truck size={18} className="text-primary-600" /> Live Tracking Timeline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = currentIdx >= idx
              const isCurrent = statusOrder[currentIdx] === step.key
              const StepIcon = step.icon

              return (
                <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors flex-shrink-0 z-10
                    ${isCompleted ? 'bg-primary-600 text-white shadow-md' : 'bg-dark-100 dark:bg-dark-800 text-dark-400'}`}>
                    <StepIcon size={18} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isCompleted ? 'text-dark-900 dark:text-white' : 'text-dark-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-dark-400">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <X size={20} className="text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">This Order Has Been Cancelled</p>
            <p className="text-xs text-red-600 dark:text-red-400">Refund processing (if paid) initiated to original payment method.</p>
          </div>
        </div>
      )}

      {/* ── Invoice Printable Area & Main Details ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-4 pb-3 border-b border-dark-100 dark:border-dark-800 flex items-center gap-2">
              <Package size={18} className="text-primary-600" /> Order Items ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-dark-100 dark:divide-dark-800">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <img
                    src={item.productThumbnail || item.product?.thumbnailUrl || '/placeholder.jpg'}
                    alt={item.productName || item.product?.name}
                    className="w-16 h-16 object-contain rounded-xl bg-dark-50 dark:bg-dark-800 p-2 border border-dark-100 dark:border-dark-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-dark-900 dark:text-white truncate">
                      {item.productName || item.product?.name}
                    </h4>
                    <p className="text-xs text-dark-400 mt-0.5">
                      Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-dark-900 dark:text-white">
                      ₹{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address & Order Summary */}
        <div className="space-y-6">

          {/* Shipping Address */}
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" /> Delivery Address
            </h3>
            <div className="text-xs text-dark-600 dark:text-dark-300 space-y-1 leading-relaxed">
              <p className="font-bold text-dark-900 dark:text-white">{order.shippingAddress?.fullName || 'Valued Customer'}</p>
              <p>{order.shippingAddress?.streetAddress || order.shippingAddress?.addressLine1}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
              <p className="text-dark-400">Phone: {order.shippingAddress?.phoneNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Payment & Amount Summary */}
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-4 pb-2 border-b border-dark-100 dark:border-dark-800 flex items-center gap-2">
              <CreditCard size={18} className="text-primary-600" /> Payment Breakdown
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-dark-500">
                <span>Subtotal</span>
                <span className="font-semibold text-dark-900 dark:text-white">₹{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-dark-500">
                <span>Shipping Fee</span>
                <span className="font-semibold text-emerald-600">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discountAmount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-dark-500">
                <span>Tax (GST)</span>
                <span className="font-semibold text-dark-900 dark:text-white">₹{order.taxAmount?.toLocaleString() || '0'}</span>
              </div>
              <div className="pt-3 border-t border-dark-100 dark:border-dark-800 flex justify-between text-sm font-black text-dark-900 dark:text-white">
                <span>Total Paid</span>
                <span className="text-primary-600 dark:text-primary-400">₹{order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between text-xs">
              <span className="text-dark-400">Payment Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {order.paymentStatus || 'PAID'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Cancel Order Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">Cancel Order #{order.orderNumber || order.id}</h3>
            <p className="text-xs text-dark-500 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Changed my mind, found better price elsewhere..."
              className="input w-full h-24 p-3 text-xs mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelModal(false)} className="btn-outline text-xs py-2 px-4">
                Keep Order
              </button>
              <button
                onClick={() => cancelMutation.mutate({ orderId: order.id, reason: cancelReason })}
                disabled={cancelMutation.isLoading}
                className="btn-danger text-xs py-2 px-4"
              >
                {cancelMutation.isLoading ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
