import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users,
  Ticket, BarChart3, Menu, LogOut, Zap, ChevronRight
} from 'lucide-react'
import { useAuth }  from '@context/AuthContext'
import { useTheme } from '@context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard',  exact: true },
  { to: '/admin/products',   icon: Package,         label: 'Products' },
  { to: '/admin/categories', icon: Tag,             label: 'Categories' },
  { to: '/admin/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/users',      icon: Users,           label: 'Users' },
  { to: '/admin/coupons',    icon: Ticket,          label: 'Coupons' },
  { to: '/admin/analytics',  icon: BarChart3,       label: 'Analytics' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout }              = useAuth()
  const { isDark, toggleTheme }       = useTheme()
  const { pathname }                  = useLocation()
  const navigate                      = useNavigate()

  return (
    <div className="flex h-screen bg-dark-50 dark:bg-dark-950 overflow-hidden">

      {/* ── Sidebar ────────────────────────────────── */}
      <aside className={`flex flex-col bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800
                         transition-all duration-300 flex-shrink-0
                         ${sidebarOpen ? 'w-60' : 'w-16'}`}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-dark-100 dark:border-dark-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          {sidebarOpen && (
            <span className="font-black text-lg font-display text-dark-900 dark:text-white">
              Shop<span className="gradient-text">Sphere</span>
            </span>
          )}
        </div>

        {/* Admin label */}
        {sidebarOpen && (
          <div className="px-4 py-3">
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-widest">Admin Panel</span>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.to || (item.to !== '/admin' && pathname.startsWith(item.to))
            return (
              <Link
                key={item.to}
                to={item.to}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all
                            ${active
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                            }`}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-dark-100 dark:border-dark-800">
          <button
            onClick={() => { logout(); navigate('/') }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error
                        hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-dark-900
                           border-b border-dark-200 dark:border-dark-800 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="btn-icon hover:bg-dark-100 dark:hover:bg-dark-800"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="btn-icon hover:bg-dark-100 dark:hover:bg-dark-800">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                {user?.fullName?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold dark:text-white">{user?.fullName}</p>
                <p className="text-xs text-dark-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
