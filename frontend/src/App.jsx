import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import MainLayout from '@components/layout/MainLayout'
import AdminLayout from '@components/layout/AdminLayout'
import PrivateRoute from '@components/auth/PrivateRoute'
import AdminRoute from '@components/auth/AdminRoute'
import PageLoader from '@components/ui/PageLoader'

// ── Customer Pages (lazy loaded) ─────────────────────────────
const LandingPage      = lazy(() => import('@pages/LandingPage'))
const HomePage         = lazy(() => import('@pages/HomePage'))
const ProductListing   = lazy(() => import('@pages/ProductListingPage'))
const ProductDetail    = lazy(() => import('@pages/ProductDetailPage'))
const CartPage         = lazy(() => import('@pages/CartPage'))
const WishlistPage     = lazy(() => import('@pages/WishlistPage'))
const CheckoutPage     = lazy(() => import('@pages/CheckoutPage'))
const OrderHistoryPage = lazy(() => import('@pages/OrderHistoryPage'))
const OrderDetailPage  = lazy(() => import('@pages/OrderDetailPage'))
const ProfilePage      = lazy(() => import('@pages/ProfilePage'))
const SearchPage       = lazy(() => import('@pages/SearchResultsPage'))
const ComparePage      = lazy(() => import('@pages/ComparePage'))
const TeamPage         = lazy(() => import('@pages/TeamPage'))
const LoginPage        = lazy(() => import('@pages/auth/LoginPage'))
const RegisterPage     = lazy(() => import('@pages/auth/RegisterPage'))
const ForgotPassword   = lazy(() => import('@pages/auth/ForgotPasswordPage'))
const ResetPassword    = lazy(() => import('@pages/auth/ResetPasswordPage'))
const VerifyEmail      = lazy(() => import('@pages/auth/VerifyEmailPage'))
const NotFoundPage     = lazy(() => import('@pages/NotFoundPage'))

// ── Admin Pages (lazy loaded) ─────────────────────────────────
const AdminDashboard   = lazy(() => import('@pages/admin/AdminDashboard'))
const AdminProducts    = lazy(() => import('@pages/admin/AdminProducts'))
const AdminCategories  = lazy(() => import('@pages/admin/AdminCategories'))
const AdminOrders      = lazy(() => import('@pages/admin/AdminOrders'))
const AdminUsers       = lazy(() => import('@pages/admin/AdminUsers'))
const AdminCoupons     = lazy(() => import('@pages/admin/AdminCoupons'))
const AdminAnalytics   = lazy(() => import('@pages/admin/AdminAnalytics'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public Routes ──────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* Customer Routes (with main layout) */}
        <Route element={<MainLayout />}>
          <Route path="/home"                element={<HomePage />} />
          <Route path="/products"            element={<ProductListing />} />
          <Route path="/products/:slug"      element={<ProductDetail />} />
          <Route path="/category/:slug"      element={<ProductListing />} />
          <Route path="/search"              element={<SearchPage />} />
          <Route path="/compare"             element={<ComparePage />} />
          <Route path="/team"                element={<TeamPage />} />

          {/* Auth Pages */}
          <Route path="/login"               element={<LoginPage />} />
          <Route path="/register"            element={<RegisterPage />} />
          <Route path="/forgot-password"     element={<ForgotPassword />} />
          <Route path="/reset-password"      element={<ResetPassword />} />
          <Route path="/verify-email"        element={<VerifyEmail />} />

          {/* Protected Customer Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart"             element={<CartPage />} />
            <Route path="/wishlist"         element={<WishlistPage />} />
            <Route path="/checkout"         element={<CheckoutPage />} />
            <Route path="/orders"           element={<OrderHistoryPage />} />
            <Route path="/orders/:id"       element={<OrderDetailPage />} />
            <Route path="/profile"          element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ── Admin Routes ───────────────────────────────── */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index                      element={<AdminDashboard />} />
          <Route path="products"            element={<AdminProducts />} />
          <Route path="categories"          element={<AdminCategories />} />
          <Route path="orders"              element={<AdminOrders />} />
          <Route path="users"               element={<AdminUsers />} />
          <Route path="coupons"             element={<AdminCoupons />} />
          <Route path="analytics"           element={<AdminAnalytics />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
