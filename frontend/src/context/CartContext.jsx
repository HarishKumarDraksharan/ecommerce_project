import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '@services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart]           = useState(null)
  const [summary, setSummary]     = useState(null)
  const [loading, setLoading]     = useState(false)

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  const fetchCart = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const [cartData, summaryData] = await Promise.all([
        cartAPI.getCart(),
        cartAPI.getSummary(),
      ])
      setCart(cartData)
      setSummary(summaryData)
    } catch (e) {
      console.error('Failed to fetch cart:', e)
    } finally {
      setLoading(false)
    }
  }, [user])

  const refreshSummary = useCallback(async () => {
    try {
      const s = await cartAPI.getSummary()
      setSummary(s)
    } catch (e) {
      console.error('Failed to refresh cart summary:', e)
      toast.error('Failed to refresh cart summary')
    }
  }, [])

  // Fetch cart whenever user logs in
  useEffect(() => {
    if (user) fetchCart()
    else { setCart(null); setSummary(null) }
  }, [user, fetchCart])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return false }
    try {
      const updated = await cartAPI.addItem(productId, quantity)
      setCart(updated)
      await refreshSummary()
      toast.success('Added to cart! 🛒')
      return true
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add to cart')
      return false
    }
  }, [user, refreshSummary])

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      const updated = await cartAPI.updateItem(cartItemId, quantity)
      setCart(updated)
      await refreshSummary()
    } catch (e) {
      toast.error('Failed to update quantity')
    }
  }, [refreshSummary])

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      const updated = await cartAPI.removeItem(cartItemId)
      setCart(updated)
      await refreshSummary()
      toast.success('Item removed')
    } catch (e) {
      console.error('Failed to remove cart item:', e)
      toast.error('Failed to remove item')
    }
  }, [refreshSummary])

  const applyCoupon = useCallback(async (code) => {
    try {
      const updated = await cartAPI.applyCoupon(code)
      setCart(updated)
      await refreshSummary()
      toast.success('Coupon applied! 🎉')
      return true
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid coupon')
      return false
    }
  }, [refreshSummary])

  const removeCoupon = useCallback(async () => {
    try {
      const updated = await cartAPI.removeCoupon()
      setCart(updated)
      await refreshSummary()
      toast.success('Coupon removed')
    } catch (e) {
      console.error('Failed to remove coupon:', e)
      toast.error(e.response?.data?.message || 'Failed to remove coupon')
    }
  }, [refreshSummary])

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clearCart()
      setCart(null)
      setSummary(null)
    } catch (e) {
      console.error('Failed to clear cart:', e)
      toast.error('Failed to clear cart')
    }
  }, [])

  return (
    <CartContext.Provider value={{
      cart, summary, loading, itemCount,
      addToCart, removeFromCart, updateQuantity,
      applyCoupon, removeCoupon, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
