import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Shield, Truck, Star, ChevronRight, Play, Zap, Award, HeartHandshake } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import Navbar from '@components/layout/Navbar'
import Footer from '@components/layout/Footer'

const FEATURES = [
  { icon: Truck,           title: 'Free Shipping',      desc: 'On all orders above ₹999. Fast delivery across India.', color: 'text-blue-500' },
  { icon: Shield,          title: 'Secure Payments',    desc: 'Razorpay encrypted transactions. Your money is safe.', color: 'text-green-500' },
  { icon: Star,            title: 'Top Quality',        desc: 'Curated products from verified sellers & brands.', color: 'text-yellow-500' },
  { icon: HeartHandshake,  title: 'Easy Returns',       desc: '7-day hassle-free return policy on all products.', color: 'text-pink-500' },
]

const STATS = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '10K+', label: 'Products' },
  { value: '500+', label: 'Brands' },
  { value: '99.5%', label: 'Satisfaction Rate' },
]

const CATEGORIES = [
  { name: 'Electronics',    emoji: '📱', slug: 'electronics', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Fashion',        emoji: '👗', slug: 'fashion',     gradient: 'from-pink-500 to-rose-500' },
  { name: 'Home & Kitchen', emoji: '🏠', slug: 'home-kitchen',gradient: 'from-orange-500 to-amber-500' },
  { name: 'Books',          emoji: '📚', slug: 'books',       gradient: 'from-purple-500 to-violet-500' },
  { name: 'Sports',         emoji: '⚽', slug: 'sports-fitness', gradient: 'from-green-500 to-emerald-500' },
  { name: 'Beauty',         emoji: '💄', slug: 'beauty-personal', gradient: 'from-fuchsia-500 to-pink-500' },
]

// ── Reusable Animation Wrapper ────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 overflow-x-hidden">
      <Navbar transparent />

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-900 to-accent-900" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
              <Zap size={14} className="text-yellow-400" />
              New arrivals every week
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black font-display mb-6 leading-tight"
          >
            Shop the{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Future
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10"
          >
            Discover thousands of products with the best prices, secure payments, and lightning-fast delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/home" className="btn-primary btn-lg text-base shadow-glow group">
              <ShoppingBag size={20} />
              Start Shopping
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products" className="btn-lg border-2 border-white/30 text-white backdrop-blur-sm hover:bg-white/10 transition-all flex items-center gap-2 rounded-2xl px-7 py-3.5 font-semibold">
              <Play size={16} className="fill-white" />
              Explore Catalog
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs text-center"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto mb-2 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
          Scroll to explore
        </motion.div>
      </section>

      {/* ── CATEGORIES SECTION ───────────────────────────── */}
      <section className="section bg-dark-50 dark:bg-dark-900">
        <div className="container-custom">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Everything you need, organized perfectly</p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <FadeUp key={cat.slug} delay={i * 0.05}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-dark-800
                             hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient}
                                  flex items-center justify-center text-3xl mb-3
                                  group-hover:scale-110 transition-transform duration-300`}>
                    {cat.emoji}
                  </div>
                  <span className="text-sm font-semibold text-center text-dark-700 dark:text-dark-200
                                   group-hover:text-primary-500 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ─────────────────────────────── */}
      <section className="section">
        <div className="container-custom">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="section-title">Why Choose ShopSphere?</h2>
              <p className="section-subtitle">We&apos;re committed to the best shopping experience</p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="card p-6 text-center group hover:shadow-card-hover hover:-translate-y-1 transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-dark-50 dark:bg-dark-700 flex items-center justify-center mx-auto mb-4
                                   group-hover:scale-110 transition-transform`}>
                    <f.icon size={28} className={f.color} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-dark-900 dark:text-white">{f.title}</h3>
                  <p className="text-dark-500 dark:text-dark-400 text-sm">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────── */}
      <section className="section">
        <div className="container-custom">
          <FadeUp>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 p-10 md:p-16 text-center text-white">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <Award size={48} className="mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl md:text-5xl font-black font-display mb-4">
                Ready to Start Shopping?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Join 50,000+ happy customers. Create your account today and get 10% off your first order!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register"
                  className="bg-white text-primary-600 font-bold px-8 py-4 rounded-2xl hover:bg-dark-50 transition-colors text-lg shadow-lg">
                  Create Free Account
                </Link>
                <Link to="/home"
                  className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors text-lg">
                  Browse Products
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}
