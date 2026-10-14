import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye, Scale } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCart } from '@context/CartContext'
import { useCompare } from '@context/CompareContext'
import RatingStars from '@components/ui/RatingStars'

export default function ProductCard({ product: p, listView = false }) {
  const { addToCart }     = useCart()
  const { addToCompare, isInCompare } = useCompare()
  const [adding, setAdding] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const discount = p.discountPercent > 0 ? Math.round(p.discountPercent) : null
  const inCompare = isInCompare(p.id)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    setAdding(true)
    await addToCart(p.id, 1)
    setAdding(false)
  }

  if (listView) {
    return (
      <Link to={`/products/${p.slug}`} className="card card-hover p-4 flex gap-4 group">
        <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-dark-100 dark:bg-dark-700">
          <img src={p.thumbnailUrl || '/placeholder.jpg'} alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary-500 font-semibold uppercase mb-1">{p.brand}</p>
          <h3 className="font-semibold text-dark-900 dark:text-white mb-2 line-clamp-2">{p.name}</h3>
          <RatingStars rating={p.avgRating} size={12} />
          <div className="flex items-center gap-2 mt-2">
            <span className="font-black text-lg dark:text-white">₹{p.price?.toLocaleString('en-IN')}</span>
            {p.originalPrice > p.price && (
              <span className="text-sm text-dark-400 line-through">₹{p.originalPrice?.toLocaleString('en-IN')}</span>
            )}
            {discount && <span className="badge badge-success text-xs">{discount}% off</span>}
          </div>
        </div>
        <button onClick={handleAddToCart}
          disabled={adding || !p.inStock}
          className="self-center btn-primary btn-sm flex-shrink-0 disabled:opacity-50">
          <ShoppingCart size={14} />
          {adding ? '...' : 'Add'}
        </button>
      </Link>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/products/${p.slug}`} className="block product-card group">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-dark-50 dark:bg-dark-800">
          <img
            src={p.thumbnailUrl || '/placeholder.jpg'}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <span className="badge bg-red-500 text-white text-xs px-2 py-0.5">-{discount}%</span>
            )}
            {p.bestSeller && (
              <span className="badge bg-amber-500 text-white text-xs px-2 py-0.5">🔥 Best Seller</span>
            )}
            {!p.inStock && (
              <span className="badge bg-dark-700 text-white text-xs px-2 py-0.5">Out of Stock</span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
            <button
              onClick={e => { e.preventDefault(); setWishlisted(w => !w) }}
              title="Add to wishlist"
              className={`w-8 h-8 rounded-full bg-white dark:bg-dark-800 shadow-md flex items-center justify-center
                          hover:scale-110 transition-transform ${wishlisted ? 'text-red-500' : 'text-dark-500'}`}
            >
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={e => { e.preventDefault(); addToCompare(p) }}
              title="Add to compare"
              className={`w-8 h-8 rounded-full bg-white dark:bg-dark-800 shadow-md flex items-center justify-center
                          hover:scale-110 transition-transform ${inCompare ? 'text-primary-600 font-bold' : 'text-dark-500'}`}
            >
              <Scale size={14} />
            </button>
            <Link to={`/products/${p.slug}`} onClick={e => e.stopPropagation()}
              title="Quick view"
              className="w-8 h-8 rounded-full bg-white dark:bg-dark-800 shadow-md flex items-center justify-center hover:scale-110 transition-transform text-dark-500">
              <Eye size={14} />
            </Link>
          </div>

          {/* Add to Cart Overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={adding || !p.inStock}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm
                         flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors"
            >
              <ShoppingCart size={16} />
              {adding ? 'Adding...' : p.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          {p.brand && (
            <p className="text-xs text-primary-500 font-semibold uppercase mb-1 tracking-wide">{p.brand}</p>
          )}
          <h3 className="font-semibold text-sm text-dark-800 dark:text-dark-100 line-clamp-2 mb-2 leading-snug">
            {p.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <RatingStars rating={p.avgRating} size={11} />
            <span className="text-xs text-dark-400">({p.reviewCount})</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-base text-dark-900 dark:text-white">
              ₹{p.price?.toLocaleString('en-IN')}
            </span>
            {p.originalPrice > p.price && (
              <span className="text-xs text-dark-400 line-through">
                ₹{p.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
