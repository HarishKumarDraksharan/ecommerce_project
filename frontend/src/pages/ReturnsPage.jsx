import { Link } from 'react-router-dom'
import { RotateCcw, RefreshCw, CreditCard, Package, Headphones, Clock, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react'

const RETURN_STEPS = [
  {
    step: '01',
    title: 'Initiate Return',
    desc: 'Go to My Orders, select the item, and click "Return / Refund". Fill in the reason for return.',
  },
  {
    step: '02',
    title: 'Schedule Pickup',
    desc: 'We'll arrange a free courier pickup from your address within 24–48 hours of your request.',
  },
  {
    step: '03',
    title: 'Item Inspection',
    desc: 'Once we receive the item, our team inspects it within 1–2 business days to verify condition.',
  },
  {
    step: '04',
    title: 'Refund Processed',
    desc: 'Refund is credited to your original payment method within 5–7 business days after inspection.',
  },
]

const POLICY_CARDS = [
  {
    icon: Clock,
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    iconColor: 'text-rose-500',
    title: '7-Day Return Window',
    desc: 'Return any eligible product within 7 days of delivery. The item must be unused, unwashed, and in original packaging.',
  },
  {
    icon: RefreshCw,
    iconBg: 'bg-blue-50 dark:bg-blue-950/40',
    iconColor: 'text-blue-500',
    title: 'Instant Replacement',
    desc: 'Prefer a replacement over a refund? We'll dispatch the new unit immediately after completing your return pickup.',
  },
  {
    icon: CreditCard,
    iconBg: 'bg-green-50 dark:bg-green-950/40',
    iconColor: 'text-green-500',
    title: 'Refund to Source',
    desc: 'Refunds are credited to your original payment method — UPI, card, net banking, or wallet — within 5–7 business days.',
  },
  {
    icon: Package,
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-500',
    title: 'Free Return Pickup',
    desc: 'We arrange free courier pickup from your registered address. No need to drop off at any store or service point.',
  },
  {
    icon: CheckCircle2,
    iconBg: 'bg-purple-50 dark:bg-purple-950/40',
    iconColor: 'text-purple-500',
    title: 'No Questions Asked',
    desc: 'For eligible products, we honor returns without asking for a specific reason. Simply initiate the return from your account.',
  },
  {
    icon: Headphones,
    iconBg: 'bg-teal-50 dark:bg-teal-950/40',
    iconColor: 'text-teal-500',
    title: '24/7 Customer Support',
    desc: 'Our support team is always available to assist you with returns, refund status updates, or replacement requests.',
  },
]

const NON_RETURNABLE = [
  'Digital products and gift cards',
  'Perishable items and groceries',
  'Innerwear, swimwear, and hygiene products',
  'Customised or personalised products',
  'Items marked "Non-Returnable" on the product page',
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Page header */}
      <div className="bg-gray-50 dark:bg-[#0d0d0d] border-b border-gray-100 dark:border-white/5 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center">
              <RotateCcw size={18} className="text-rose-500" />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Policy</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Returns & Refund Policy</h1>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Hassle-free returns and fast refunds. Here's everything you need to know.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Policy cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {POLICY_CARDS.map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
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

        {/* How it works — step tracker */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">How the Return Process Works</h2>
          <div className="space-y-0">
            {RETURN_STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-5 relative">
                {/* Connector line */}
                {i < RETURN_STEPS.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-[1px] bg-gray-100 dark:bg-white/8" />
                )}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-xs font-bold z-10">
                  {s.step}
                </div>
                <div className={`pb-8 ${i === RETURN_STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{s.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-returnable items */}
        <div className="rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/8 flex items-center gap-2">
            <AlertCircle size={15} className="text-gray-400" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Non-Returnable Items</p>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {NON_RETURNABLE.map(item => (
              <li key={item} className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Refund note */}
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-5">
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-1">Important</p>
          <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
            Products must be returned in their original condition with all tags, packaging, and accessories.
            Items showing signs of use, damage, or missing components may not be eligible for a full refund.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-6 py-3 rounded-full text-sm hover:opacity-80 transition-opacity"
          >
            View My Orders <ArrowRight size={15} />
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
