import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingCart, Heart, User, Sun, Moon, Menu, X,
  LogOut, Package, Settings, ChevronDown, Zap, Scale, Loader2
} from 'lucide-react'
import { useAuth }  from '@context/AuthContext'
import { useCart }  from '@context/CartContext'
import { useTheme } from '@context/ThemeContext'
import { useCompare } from '@context/CompareContext'

export default function Navbar({ transparent = false }) {
  const navigate     = useNavigate()
  const [q, setQ]    = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { itemCount }             = useCart()
  const { isDark, toggleTheme }   = useTheme()
  const { compareList }           = useCompare()
  const profileRef                = useRef(null)
  const searchRef                 = useRef(null)

  // Track scroll for transparent navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close search suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Live autocomplete search suggestions
  useEffect(() => {
    if (!q.trim() || q.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q.trim())}&size=5`)
        const data = await res.json()
        if (data.success && data.data?.content) {
          setSuggestions(data.data.content)
          setShowSuggestions(true)
        }
      } catch (err) {
        console.error('Error fetching suggestions', err)
      } finally {
        setLoadingSuggestions(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [q])

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`)
      setQ('')
      setShowSuggestions(false)
      setMenuOpen(false)
    }
  }

  const handleSelectSuggestion = (slug) => {
    navigate(`/products/${slug}`)
    setQ('')
    setShowSuggestions(false)
  }

  const navBg = transparent && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-md shadow-sm border-b border-dark-100 dark:border-dark-800'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container-custom">
        <nav className="h-16 flex items-center justify-between gap-4">

          {/* ── Logo ──────────────────────────────── */}
          <div className="flex items-center gap-6">
            <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <span className={`font-black text-xl font-display hidden sm:block
                               ${transparent && !scrolled ? 'text-white' : 'text-dark-900 dark:text-white'}`}>
                Shop<span className="gradient-text">Sphere</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-semibold">
              <Link to="/products" className={`hover:text-primary-600 transition-colors ${transparent && !scrolled ? 'text-white/90 hover:text-white' : 'text-dark-700 dark:text-dark-200'}`}>
                Products
              </Link>
              <Link to="/compare" className={`hover:text-primary-600 transition-colors ${transparent && !scrolled ? 'text-white/90 hover:text-white' : 'text-dark-700 dark:text-dark-200'}`}>
                Compare
              </Link>
              <Link to="/team" className={`hover:text-primary-600 transition-colors ${transparent && !scrolled ? 'text-white/90 hover:text-white' : 'text-dark-700 dark:text-dark-200'}`}>
                Team Project
              </Link>
            </div>
          </div>

          {/* ── Search Bar (desktop) ─────────────────── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-3 text-dark-400" />
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search products, categories, brands..."
                className="input pl-10 pr-10 py-2.5 text-sm"
              />
              {loadingSuggestions && (
                <Loader2 size={16} className="absolute right-3.5 top-3 text-primary-500 animate-spin" />
              )}
            </div>

            {/* Live Autocomplete Suggestions Popup */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 top-12 bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-dark-50 dark:divide-dark-800"
                >
                  <div className="p-2 text-xs font-semibold uppercase tracking-wider text-dark-400 bg-dark-50/50 dark:bg-dark-800/50 px-3">
                    Search Suggestions
                  </div>
                  {suggestions.map(prod => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(prod.slug || prod.id)}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-dark-50 dark:hover:bg-dark-800/80 text-left transition-colors"
                    >
                      <img
                        src={prod.thumbnailUrl || prod.images?.[0]}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-md bg-dark-100 dark:bg-dark-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-dark-900 dark:text-white truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-dark-400">
                          {prod.categoryName || prod.brand}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                        ₹{prod.price?.toLocaleString()}
                      </span>
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="w-full p-2.5 text-center text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
                  >
                    View all results for "{q}"
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* ── Right Actions ─────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Dark / Light Mode"
              className={`btn-icon ${transparent && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-dark-100 dark:hover:bg-dark-800'}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Compare */}
            <Link
              to="/compare"
              title="Product Comparison"
              className={`btn-icon relative ${transparent && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-dark-100 dark:hover:bg-dark-800'}`}
            >
              <Scale size={18} />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist"
                className={`btn-icon relative ${transparent && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-dark-100 dark:hover:bg-dark-800'}`}>
                <Heart size={18} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart"
              className={`btn-icon relative ${transparent && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-dark-100 dark:hover:bg-dark-800'}`}>
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors
                              ${transparent && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-dark-100 dark:hover:bg-dark-800'}`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className={`hidden md:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 card shadow-dropdown py-2 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-dark-100 dark:border-dark-700">
                        <p className="font-semibold text-sm dark:text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-dark-400 truncate">{user.email}</p>
                      </div>
                      {[
                        { to: '/profile', icon: User,    label: 'My Profile' },
                        { to: '/orders',  icon: Package, label: 'My Orders' },
                        ...(isAdmin() ? [{ to: '/admin', icon: Settings, label: 'Admin Panel' }] : []),
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 dark:text-dark-200
                                     hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                        >
                          <item.icon size={15} /> {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { logout(); setProfileOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error
                                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-dark-100 dark:border-dark-700 mt-1"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login"    className={`btn btn-sm ${transparent && !scrolled ? 'border border-white/30 text-white hover:bg-white/10' : 'btn-ghost'}`}>Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={`md:hidden btn-icon ${transparent && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-dark-100 dark:hover:bg-dark-800'}`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ──────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800"
            >
              <div className="p-4 space-y-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search products..."
                    className="input flex-1"
                  />
                  <button type="submit" className="btn-primary btn-sm px-4"><Search size={16} /></button>
                </form>

                <div className="flex flex-col gap-2 pt-2 border-t border-dark-100 dark:border-dark-800 text-sm font-semibold">
                  <Link to="/products" onClick={() => setMenuOpen(false)} className="text-dark-800 dark:text-dark-200 hover:text-primary-600 py-1">
                    Explore Products
                  </Link>
                  <Link to="/compare" onClick={() => setMenuOpen(false)} className="text-dark-800 dark:text-dark-200 hover:text-primary-600 py-1">
                    Product Comparison
                  </Link>
                  <Link to="/team" onClick={() => setMenuOpen(false)} className="text-dark-800 dark:text-dark-200 hover:text-primary-600 py-1">
                    Team Project Details
                  </Link>
                </div>
                {!user ? (
                  <div className="flex gap-2">
                    <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-outline flex-1 justify-center text-sm py-2.5">Login</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 justify-center text-sm py-2.5">Sign Up</Link>
                  </div>
                ) : (
                  <button onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full btn-danger text-sm py-2.5 justify-center">
                    <LogOut size={15} /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
