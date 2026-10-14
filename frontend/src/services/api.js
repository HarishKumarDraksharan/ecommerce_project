import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// ── Axios Instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor: Attach JWT ───────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor: Auto-refresh on 401 ─────────────────
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response.data,   // Unwrap data directly
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        isRefreshing = false
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, null, {
          params: { refreshToken },
        })
        const { accessToken, refreshToken: newRefresh } = response.data.data

        localStorage.setItem('accessToken',  accessToken)
        localStorage.setItem('refreshToken', newRefresh)

        api.defaults.headers.Authorization = `Bearer ${accessToken}`
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        processQueue(null, accessToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ═══════════════════════════════════════════════════════════════
// API Service Functions
// ═══════════════════════════════════════════════════════════════

export const unwrapApiResponse = (response) =>
  response?.success === true ? response.data : response

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => api.post('/auth/register', data).then(r => r.data),
  login:          (data) => api.post('/auth/login', data).then(r => r.data),
  logout:         ()     => api.post('/auth/logout'),
  refreshToken:   (token) => api.post('/auth/refresh-token', null, { params: { refreshToken: token }}),
  verifyEmail:    (token) => api.get('/auth/verify-email', { params: { token }}),
  forgotPassword: (email) => api.post('/auth/forgot-password', null, { params: { email }}),
  resetPassword:  (token, newPassword) => api.post('/auth/reset-password', null, { params: { token, newPassword }}),
}

// ── Products ──────────────────────────────────────────────────
export const productAPI = {
  getAll:        (params) => api.get('/products', { params }).then(unwrapApiResponse),
  getById:       (id)     => api.get(`/products/${id}`),
  getBySlug:     (slug)   => api.get(`/products/slug/${slug}`),
  search:        (params) => api.get('/products/search', { params }).then(unwrapApiResponse),
  getByCategory: (id, p)  => api.get(`/products/category/${id}`, { params: p }).then(unwrapApiResponse),
  getFeatured:   ()       => api.get('/products/featured').then(r => r.data || r),
  getBestSellers:()       => api.get('/products/best-sellers').then(r => r.data || r),
  getTrending:   ()       => api.get('/products/trending').then(r => r.data || r),
  getDeals:      ()       => api.get('/products/deals').then(r => r.data || r),
  getBrands:     ()       => api.get('/products/brands'),
  create:        (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  update:        (id, d)  => api.put(`/products/${id}`, d, { headers: { 'Content-Type': 'multipart/form-data' }}),
  delete:        (id)     => api.delete(`/products/${id}`),
  updateStock:   (id, qty)=> api.patch(`/products/${id}/stock`, null, { params: { quantity: qty }}),
  getLowStock:   ()       => api.get('/products/low-stock'),
}

// ── Categories ────────────────────────────────────────────────
export const categoryAPI = {
  getAll:        ()    => api.get('/categories'),
  getById:       (id)  => api.get(`/categories/${id}`),
  getBySlug:     (slug)=> api.get(`/categories/slug/${slug}`),
  create:        (d)   => api.post('/categories', d),
  update:        (id, d)=> api.put(`/categories/${id}`, d),
  delete:        (id)  => api.delete(`/categories/${id}`),
}

// ── Cart ──────────────────────────────────────────────────────
export const cartAPI = {
  getCart:      ()          => api.get('/cart').then(r => r.data),
  getSummary:   ()          => api.get('/cart/summary').then(r => r.data),
  addItem:      (productId, quantity) => api.post('/cart/items', null, { params: { productId, quantity }}).then(r => r.data),
  updateItem:   (id, qty)   => api.put(`/cart/items/${id}`, null, { params: { quantity: qty }}).then(r => r.data),
  removeItem:   (id)        => api.delete(`/cart/items/${id}`).then(r => r.data),
  clearCart:    ()          => api.delete('/cart'),
  applyCoupon:  (code)      => api.post('/cart/coupon', null, { params: { code }}).then(r => r.data),
  removeCoupon: ()          => api.delete('/cart/coupon').then(r => r.data),
}

// ── Wishlist ──────────────────────────────────────────────────
export const wishlistAPI = {
  getAll:   ()    => api.get('/wishlist'),
  toggle:   (pid) => api.post(`/wishlist/${pid}`),
  remove:   (pid) => api.delete(`/wishlist/${pid}`),
}

// ── Orders ────────────────────────────────────────────────────
export const orderAPI = {
  placeOrder:   (params)  => api.post('/orders', null, { params }),
  getMyOrders:  (params)  => api.get('/orders', { params }),
  getById:      (id)      => api.get(`/orders/${id}`),
  trackOrder:   (num)     => api.get(`/orders/number/${num}`),
  cancelOrder:  (id, reason) => api.post(`/orders/${id}/cancel`, null, { params: { reason }}),
  returnRequest:(id, reason) => api.post(`/orders/${id}/return`, null, { params: { reason }}),
}

// ── Reviews ───────────────────────────────────────────────────
export const reviewAPI = {
  getByProduct: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  create:       (data)  => api.post('/reviews', data),
  update:       (id, d) => api.put(`/reviews/${id}`, d),
  delete:       (id)    => api.delete(`/reviews/${id}`),
}

// ── Payments ──────────────────────────────────────────────────
export const paymentAPI = {
  createRazorpayOrder: (orderId) => api.post(`/payments/razorpay/create-order/${orderId}`),
  verifyPayment:       (data)    => api.post('/payments/razorpay/verify', data),
}

// ── Users (Customer) ──────────────────────────────────────────
export const userAPI = {
  getProfile:     ()     => api.get('/users/profile'),
  updateProfile:  (d)    => api.put('/users/profile', d),
  changePassword: (d)    => api.put('/users/change-password', d),
  getAddresses:   ()     => api.get('/users/addresses'),
  addAddress:     (d)    => api.post('/users/addresses', d),
  updateAddress:  (id,d) => api.put(`/users/addresses/${id}`, d),
  deleteAddress:  (id)   => api.delete(`/users/addresses/${id}`),
  setDefault:     (id)   => api.patch(`/users/addresses/${id}/default`),
}

// ── Admin ─────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard:   ()      => api.get('/admin/dashboard'),
  getAllUsers:     (p)     => api.get('/admin/users', { params: p }),
  updateUserStatus:(id,e) => api.patch(`/admin/users/${id}/status`, null, { params: { enabled: e }}),
  getAllOrders:    (p)     => api.get('/admin/orders', { params: p }),
  updateOrderStatus:(id,s)=> api.patch(`/admin/orders/${id}/status`, null, { params: { status: s }}),
  getSalesReport: (p)     => api.get('/admin/reports/sales', { params: p }),
  getRevenuReport:(p)     => api.get('/admin/reports/revenue', { params: p }),
}

export default api
