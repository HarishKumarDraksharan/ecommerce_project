import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { orderAPI } from '@services/api'
import { Package, Truck, Clock, CheckCircle2, AlertCircle, ArrowRight, ShoppingBag, Eye, Search } from 'lucide-react'

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderAPI.getMyOrders(),
  })

  const ordersData = ordersResponse?.data || ordersResponse
  const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.content || ordersData?.data || [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = (order.orderNumber || order.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[10px] uppercase rounded-full flex items-center gap-1"><CheckCircle2 size={12} /> Delivered</span>
      case 'SHIPPED':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-[10px] uppercase rounded-full flex items-center gap-1"><Truck size={12} /> In Transit</span>
      case 'PROCESSING':
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[10px] uppercase rounded-full flex items-center gap-1"><Clock size={12} /> Processing</span>
      case 'CANCELLED':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold text-[10px] uppercase rounded-full flex items-center gap-1"><AlertCircle size={12} /> Cancelled</span>
      default:
        return <span className="px-2.5 py-1 bg-dark-100 text-dark-800 dark:bg-dark-800 dark:text-dark-300 font-bold text-[10px] uppercase rounded-full">{status || 'PLACED'}</span>
    }
  }

  return (
    <div className="container-custom py-10">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white flex items-center gap-3">
            <Package size={28} className="text-primary-600" /> My Orders & Purchase History
          </h1>
          <p className="text-xs sm:text-sm text-dark-500 mt-1">
            Track live package delivery, view item details, and download invoices.
          </p>
        </div>
        <Link to="/products" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2">
          <ShoppingBag size={15} /> Continue Shopping
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-dark-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID or number..."
            className="input w-full pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex-shrink-0 ${
                statusFilter === st
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-dark-500">Retrieving your order history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">No Orders Found</h3>
          <p className="text-xs text-dark-500 mb-6 leading-relaxed">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No orders match your current filter search query.'
              : 'You haven\'t placed any orders yet. Start exploring our latest products!'}
          </p>
          <Link to="/products" className="btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-2">
            Explore Products <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-dark-100 dark:border-dark-800">
                <div>
                  <p className="text-xs text-dark-400">Order Number</p>
                  <p className="font-bold text-sm text-dark-900 dark:text-white">#{order.orderNumber || order.id}</p>
                </div>

                <div>
                  <p className="text-xs text-dark-400">Order Date</p>
                  <p className="font-semibold text-xs text-dark-700 dark:text-dark-300">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-dark-400">Total Amount</p>
                  <p className="font-black text-sm text-primary-600 dark:text-primary-400">
                    ₹{order.totalAmount?.toLocaleString()}
                  </p>
                </div>

                <div>
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Product Preview Items */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items?.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-dark-50 dark:bg-dark-800/60 p-2 rounded-xl border border-dark-100 dark:border-dark-700">
                      <img
                        src={item.productThumbnail || item.product?.thumbnailUrl || '/placeholder.jpg'}
                        alt={item.productName || item.product?.name}
                        className="w-10 h-10 object-contain rounded-lg bg-white dark:bg-dark-900 p-1"
                      />
                      <div className="text-xs pr-2 max-w-[120px]">
                        <p className="font-semibold text-dark-900 dark:text-white truncate">{item.productName || item.product?.name}</p>
                        <p className="text-[10px] text-dark-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <span className="text-xs font-bold text-dark-400 bg-dark-100 dark:bg-dark-800 px-3 py-2 rounded-xl">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5 flex-shrink-0"
                >
                  <Eye size={14} /> Order Details & Track
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
