import { Link } from 'react-router-dom'
import { Truck, Clock, MapPin, Zap, Package, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'

const DELIVERY_INFO = [
  {
    icon: CheckCircle2,
    iconBg: 'bg-blue-50 dark:bg-blue-950/40',
    iconColor: 'text-blue-500',
    title: 'Free Delivery on ₹999+',
    desc: 'All orders above ₹999 qualify for free standard delivery — no promo code needed. Applied automatically at checkout.',
  },
  {
    icon: Clock,
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-500',
    title: 'Estimated Delivery Time',
    desc: 'Standard delivery: 3–7 business days. Express delivery: 1–2 business days (₹99 additional charge).',
  },
  {
    icon: MapPin,
    iconBg: 'bg-green-50 dark:bg-green-950/40',
    iconColor: 'text-green-500',
    title: 'Pan-India Coverage',
    desc: 'We deliver to 25,000+ pin codes across all states and union territories in India, including tier-2 and tier-3 cities.',
  },
  {
    icon: Zap,
    iconBg: 'bg-purple-50 dark:bg-purple-950/40',
    iconColor: 'text-purple-500',
    title: 'Express Delivery',
    desc: 'Need it sooner? Choose express delivery at checkout for guaranteed delivery within 1–2 business days.',
  },
  {
    icon: Package,
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    iconColor: 'text-rose-500',
    title: 'Order Tracking',
    desc: 'Track your order in real time via SMS, email, and your ShopSphere account. Live updates from dispatch to doorstep.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-teal-50 dark:bg-teal-950/40',
    iconColor: 'text-teal-500',
    title: 'Safe & Secure Packaging',
    desc: 'All products are carefully packaged to prevent damage during transit. Fragile items receive extra protective packaging.',
  },
]

const DELIVERY_TABLE = [
  { zone: 'Metro Cities',      standard: '2–4 days', express: '1 day' },
  { zone: 'Tier-2 Cities',     standard: '3–5 days', express: '2 days' },
  { zone: 'Rest of India',     standard: '5–7 days', express: '2–3 days' },
  { zone: 'Remote Areas',      standard: '7–10 days',express: 'Not available' },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Page header */}
      <div className="bg-gray-50 dark:bg-[#0d0d0d] border-b border-gray-100 dark:border-white/5 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <Truck size={18} className="text-blue-500" />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Policy</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Shipping Policy</h1>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Everything you need to know about our delivery service, timelines, and coverage.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DELIVERY_INFO.map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 p-5 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/8 rounded-2xl hover:border-gray-200 dark:hover:border-white/15 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={17} className={iconColor} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery timeline table */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Delivery Timeline by Zone</h2>
          <div className="rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/8">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Zone</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Standard</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Express (₹99)</th>
                </tr>
              </thead>
              <tbody>
                {DELIVERY_TABLE.map((row, i) => (
                  <tr
                    key={row.zone}
                    className={`border-b border-gray-100 dark:border-white/5 last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-white/[0.02]'}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{row.zone}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{row.standard}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{row.express}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Business days exclude Sundays and public holidays.</p>
        </div>

        {/* Note */}
        <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-5">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Note</p>
          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
            Delivery timelines may vary during sale events, public holidays, or extreme weather conditions.
            For real-time tracking, visit your <strong>Orders</strong> page after placing an order.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-6 py-3 rounded-full text-sm hover:opacity-80 transition-opacity"
          >
            Start Shopping <ArrowRight size={15} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-full text-sm hover:border-gray-400 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
