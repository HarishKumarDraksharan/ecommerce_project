import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
    try {
      const stored = localStorage.getItem('shopsphere_compare')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('shopsphere_compare', JSON.stringify(compareList))
  }, [compareList])

  const addToCompare = (product) => {
    if (!product || !product.id) return
    if (compareList.some(p => p.id === product.id)) {
      toast.error('Product already in compare list')
      return
    }
    if (compareList.length >= 4) {
      toast.error('You can compare maximum 4 products at a time')
      return
    }
    setCompareList(prev => [...prev, product])
    toast.success(`${product.name.slice(0, 20)}... added to compare!`)
  }

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(p => p.id !== productId))
    toast.success('Product removed from compare')
  }

  const clearCompare = () => {
    setCompareList([])
    toast.success('Compare list cleared')
  }

  const isInCompare = (productId) => {
    return compareList.some(p => p.id === productId)
  }

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
