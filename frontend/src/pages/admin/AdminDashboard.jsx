import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '@services/api'
import {
  Users, ShoppingBag, DollarSign, Package, TrendingUp, TrendingDown,
  Activity, ArrowUp, AlertTriangle, ShoppingCart
} from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler)

// ── KPI Card Component ────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, change, trend, color, bg }) {
  const isPositive = trend === 'up'
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">{label}</p>
        <p className="text-2xl font-black text-dark-900 dark:text-white truncate">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs mt-1 font-medium
                          ${isPositive ? 'text-success' : 'text-error'}`}>
            {isPositive ? <ArrowUp size={12} /> : <TrendingDown size={12} />}
            <span>{change}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  )
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn:  () => adminAPI.getDashboard(),
    refetchInterval: 60000,  // Refresh every minute
  })

  const d = dashboard?.data || {}

  const revenueChartData = {
    labels: MONTHS,
    datasets: [{
      label: 'Monthly Revenue (₹)',
      data: d.monthlyRevenue || Array(12).fill(0),
      backgroundColor: 'rgba(249,115,22,0.15)',
      borderColor:     '#f97316',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#f97316',
      pointBorderColor:     '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
    }],
  }

  const orderStatusData = {
    labels: ['Delivered', 'Processing', 'Shipped', 'Cancelled', 'Returned'],
    datasets: [{
      data: d.ordersByStatus
        ? Object.values(d.ordersByStatus)
        : [45, 20, 15, 12, 8],
      backgroundColor: ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  }

  const topProductsData = {
    labels: (d.topProducts || []).map(p => p.name?.substring(0, 20) + '...'),
    datasets: [{
      label: 'Units Sold',
      data: (d.topProducts || []).map(p => p.totalSold),
      backgroundColor: '#f97316',
      borderRadius: 8,
      borderSkipped: false,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  }

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
      </div>
      <div className="skeleton h-80 rounded-xl" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black dark:text-white">Dashboard</h1>
          <p className="text-dark-500 dark:text-dark-400 text-sm">Welcome back! Here's what's happening.</p>
        </div>
        <span className="badge badge-success">Live</span>
      </div>

      {/* ── KPI Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users}       label="Total Users"   value={d.totalUsers?.toLocaleString() || '0'}
          change={12} trend="up" color="text-blue-500"   bg="bg-blue-50 dark:bg-blue-900/20" />
        <KpiCard icon={ShoppingBag} label="Total Orders"  value={d.totalOrders?.toLocaleString() || '0'}
          change={8}  trend="up" color="text-primary-500" bg="bg-primary-50 dark:bg-primary-900/20" />
        <KpiCard icon={DollarSign}  label="Total Revenue" value={`₹${(d.totalRevenue || 0).toLocaleString('en-IN')}`}
          change={18} trend="up" color="text-green-500"  bg="bg-green-50 dark:bg-green-900/20" />
        <KpiCard icon={Package}     label="Products"      value={d.totalProducts?.toLocaleString() || '0'}
          change={-3} trend="down" color="text-purple-500" bg="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* ── Charts Row 1 ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg dark:text-white">Revenue Overview</h2>
              <p className="text-dark-400 text-sm">Monthly revenue for current year</p>
            </div>
            <Activity size={20} className="text-primary-500" />
          </div>
          <Line data={revenueChartData} options={chartOptions} />
        </div>

        {/* Order Status Donut */}
        <div className="card p-6">
          <h2 className="font-bold text-lg dark:text-white mb-6">Order Status</h2>
          <Doughnut
            data={orderStatusData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 12 }}},
              },
              cutout: '60%',
            }}
          />
        </div>
      </div>

      {/* ── Charts Row 2 ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg dark:text-white">Top Selling Products</h2>
            <TrendingUp size={20} className="text-primary-500" />
          </div>
          {d.topProducts?.length > 0 ? (
            <Bar data={topProductsData} options={{
              ...chartOptions,
              indexAxis: 'y',
              scales: { ...chartOptions.scales, x: { grid: { color: 'rgba(0,0,0,0.05)' }}},
            }} />
          ) : <p className="text-center text-dark-400 py-10">No data available</p>}
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg dark:text-white">Recent Orders</h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-primary-500 text-sm font-medium hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {(d.recentOrders || []).slice(0, 5).map(order => (
              <div key={order.id}
                className="flex items-center justify-between py-2.5 border-b border-dark-100 dark:border-dark-700 last:border-0">
                <div>
                  <p className="font-semibold text-sm dark:text-white">{order.orderNumber}</p>
                  <p className="text-xs text-dark-400">{order.shippingFullName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm dark:text-white">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                  <span className={`badge text-xs ${
                    order.status === 'DELIVERED'  ? 'badge-success' :
                    order.status === 'CANCELLED'  ? 'badge-error'   :
                    order.status === 'SHIPPED'    ? 'badge-info'    :
                    'badge-warning'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
            {(!d.recentOrders || d.recentOrders.length === 0) && (
              <p className="text-center text-dark-400 py-6">No recent orders</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Low Stock Alert ────────────────────────────── */}
      {d.lowStockProducts?.length > 0 && (
        <div className="card p-6 border-l-4 border-warning">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-warning" />
            <h2 className="font-bold text-lg dark:text-white">Low Stock Alert</h2>
            <span className="badge badge-warning">{d.lowStockProducts.length} products</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {d.lowStockProducts.slice(0, 6).map(p => (
              <div key={p.id}
                className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate dark:text-white">{p.name}</p>
                  <p className="text-xs text-dark-400">{p.sku}</p>
                </div>
                <span className="badge badge-warning flex-shrink-0 ml-2">{p.stockQuantity} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
