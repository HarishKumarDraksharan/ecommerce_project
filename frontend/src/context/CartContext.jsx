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

  // Fetch cart whenever user logs in
  useEffect(() => {
    if (user) fetchCart()
    else { setCart(null); setSummary(null) }
  }, [user])

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
  }, [user])

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      const updated = await cartAPI.updateItem(cartItemId, quantity)
      setCart(updated)
      await refreshSummary()
    } catch (e) {
      toast.error('Failed to update quantity')
    }
  }, [])

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      const updated = await cartAPI.removeItem(cartItemId)
      setCart(updated)
      await refreshSummary()
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    }
  }, [])

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
  }, [])

  const removeCoupon = useCallback(async () => {
    try {
      const updated = await cartAPI.removeCoupon()
      setCart(updated)
      await refreshSummary()
      toast.success('Coupon removed')
    } catch {}
  }, [])

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clearCart()
      setCart(null)
      setSummary(null)
    } catch {}
  }, [])

  const refreshSummary = async () => {
    try {
      const s = await cartAPI.getSummary()
      setSummary(s)
    } catch {}
  }

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
