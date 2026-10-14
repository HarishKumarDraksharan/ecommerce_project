import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productAPI, categoryAPI } from '@services/api'
import ProductCard from '@components/product/ProductCard'
import ProductCardSkeleton from '@components/product/ProductCardSkeleton'
import {
  ArrowRight, Zap, TrendingUp, Tag, Flame, Clock, ShieldCheck,
  Truck, RefreshCw, Headset, Eye, Star, Quote, Mail, Send, CheckCircle2
} from 'lucide-react'

// Countdown timer component for Deals of the Day
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 12, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 font-mono text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/40 dark:text-primary-300 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900">
      <Clock size={16} className="text-primary-600" />
      <span>Ends in:</span>
      <span className="bg-primary-600 text-white px-1.5 py-0.5 rounded text-xs">{String(timeLeft.hours).padStart(2, '0')}h</span> :
      <span className="bg-primary-600 text-white px-1.5 py-0.5 rounded text-xs">{String(timeLeft.minutes).padStart(2, '0')}m</span> :
      <span className="bg-primary-600 text-white px-1.5 py-0.5 rounded text-xs">{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  )
}

export default function HomePage() {
  // Queries
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured'],
    queryFn: productAPI.getFeatured,
  })

  const { data: bestSellersData, isLoading: loadingBS } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: productAPI.getBestSellers,
  })

  const { data: trendingData, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending'],
    queryFn: productAPI.getTrending,
  })

  const { data: dealsData, isLoading: loadingDeals } = useQuery({
    queryKey: ['deals'],
    queryFn: productAPI.getDeals,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryAPI.getAll,
  })

  // Recently Viewed items from localStorage
  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopsphere_recently_viewed')
      if (stored) setRecentlyViewed(JSON.parse(stored))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const featured = Array.isArray(featuredData) ? featuredData : (featuredData?.data || [])
  const bestSellers = Array.isArray(bestSellersData) ? bestSellersData : (bestSellersData?.data || [])
  const trending = Array.isArray(trendingData) ? trendingData : (trendingData?.data || [])
  const deals = Array.isArray(dealsData) ? dealsData : (dealsData?.data || [])
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || [])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-blue-900 text-white py-16 lg:py-20 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-4 text-blue-100 border border-white/20">
              <Zap size={14} className="fill-blue-200 text-blue-200" /> B.Tech Final Year Demonstration Project
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              Next-Gen E-Commerce Shopping Engine
            </h1>
            <p className="text-blue-100 text-base sm:text-lg mb-8 leading-relaxed">
              Explore multi-category items, real-time cart tracking, secure checkout with Razorpay demo mode, and intelligent admin insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary bg-white text-primary-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2">
                Explore All Products <ArrowRight size={18} />
              </Link>
              <Link to="/compare" className="btn-outline border-white/40 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition-all">
                Compare Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust Badges Bar ──────────────────────────────────── */}
      <div className="border-b border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-900/50 py-4">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-3 p-2">
            <Truck size={22} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-dark-900 dark:text-white">Free Express Shipping</p>
              <p className="text-[11px] text-dark-500">On all orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-2">
            <ShieldCheck size={22} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-dark-900 dark:text-white">Secure Payments</p>
              <p className="text-[11px] text-dark-500">Razorpay & SSL encrypted</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-2">
            <RefreshCw size={22} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-dark-900 dark:text-white">7-Day Easy Returns</p>
              <p className="text-[11px] text-dark-500">100% money back guarantee</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-2">
            <Headset size={22} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-dark-900 dark:text-white">24/7 Student Support</p>
              <p className="text-[11px] text-dark-500">Fast assistance & guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Categories Grid ───────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-12 border-b border-dark-100 dark:border-dark-800">
          <div className="container-custom">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group card p-3 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-sm"
                >
                  <img
                    src={cat.image || '/placeholder.jpg'}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-full mx-auto mb-3 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="font-semibold text-xs text-dark-900 dark:text-white group-hover:text-primary-600 truncate">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Deals of the Day (with Countdown) ────────────────── */}
      <section className="py-12 bg-blue-50/40 dark:bg-dark-900/40 border-b border-blue-100 dark:border-dark-800">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold">
                <Tag size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
                  Deals of the Day
                </h2>
                <p className="text-xs text-dark-500">Limited time discounts up to 35% off</p>
              </div>
            </div>
            <CountdownTimer />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loadingDeals
              ? Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : deals.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────── */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
                <Zap size={22} className="text-primary-600" /> Featured Products
              </h2>
              <p className="text-xs text-dark-500">Handpicked premium selections</p>
            </div>
            <Link to="/products?featured=true" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loadingFeatured
              ? Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.slice(0, 10).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Trending Products ─────────────────────────────────── */}
      <section className="py-12 bg-dark-50/50 dark:bg-dark-900/50 border-y border-dark-100 dark:border-dark-800">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
                <Flame size={22} className="text-amber-500" /> Trending Products
              </h2>
              <p className="text-xs text-dark-500">Currently high in demand</p>
            </div>
            <Link to="/products" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loadingTrending
              ? Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : trending.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ───────────────────────────────────────── */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={22} className="text-emerald-600" /> Best Sellers
              </h2>
              <p className="text-xs text-dark-500">Top customer favorites</p>
            </div>
            <Link to="/products" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loadingBS
              ? Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellers.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Recently Viewed Section ───────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <section className="py-12 bg-dark-50/50 dark:bg-dark-900/50 border-t border-dark-100 dark:border-dark-800">
          <div className="container-custom">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6 flex items-center gap-2">
              <Eye size={20} className="text-primary-600" /> Recently Viewed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentlyViewed.slice(0, 5).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Customer Reviews & Testimonials ────────────────────── */}
      <section className="py-16 border-t border-dark-100 dark:border-dark-800">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 block">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white mb-3">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-dark-500">
              Real reviews from real buyers who experienced our fast checkout and authentic products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: 'Rahul Sharma',
                role: 'Tech Enthusiast',
                rating: 5,
                comment: 'The product comparison feature helped me select the perfect wireless headphones. Fast delivery and smooth payment with Razorpay!',
                avatar: 'RS',
                date: '2 days ago'
              },
              {
                id: 2,
                name: 'Priya Verma',
                role: 'Verified Buyer',
                rating: 5,
                comment: 'Clean and modern UI. Tracking order status in real-time was super convenient. ShopSphere exceeded my expectations!',
                avatar: 'PV',
                date: '1 week ago'
              },
              {
                id: 3,
                name: 'Ankit Patel',
                role: 'Gadget Collector',
                rating: 5,
                comment: 'Awesome B.Tech demonstration project! Highly responsive on mobile screens, smooth cart updates, and genuine product quality.',
                avatar: 'AP',
                date: '2 weeks ago'
              }
            ].map((review) => (
              <div key={review.id} className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <Quote size={32} className="text-primary-100 dark:text-primary-950 absolute top-4 right-4" />
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {Array(review.rating).fill(0).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed mb-6 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-dark-100 dark:border-dark-800">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-bold text-xs flex items-center justify-center">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-dark-900 dark:text-white flex items-center gap-1">
                      {review.name} <CheckCircle2 size={12} className="text-emerald-500" />
                    </h4>
                    <p className="text-[10px] text-dark-400">{review.role} • {review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter Section ─────────────────────────────────── */}
      <section className="py-12 bg-primary-600 dark:bg-primary-950 text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Mail size={24} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Subscribe to Special Offers & Updates
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mb-8 max-w-xl mx-auto">
              Get secret discount coupons like <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold text-white">WELCOME10</code> and <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold text-white">SUMMER20</code> directly in your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!') }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className="px-4 py-3 rounded-xl bg-white text-dark-900 text-sm focus:outline-none flex-1 placeholder:text-dark-400"
              />
              <button
                type="submit"
                className="bg-dark-900 hover:bg-dark-950 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 flex-shrink-0"
              >
                Subscribe <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
