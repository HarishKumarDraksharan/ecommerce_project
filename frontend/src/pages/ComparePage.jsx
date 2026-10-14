import { Link } from 'react-router-dom'
import { Scale, Trash2, ShoppingCart, Star, ArrowLeft, Check, X } from 'lucide-react'
import { useCompare } from '@context/CompareContext'
import { useCart } from '@context/CartContext'

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()

  if (compareList.length === 0) {
    return (
      <div className="container-custom py-16 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scale size={32} />
        </div>
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">No Products to Compare</h2>
        <p className="text-dark-500 dark:text-dark-400 mb-6 text-sm">
          Select up to 4 products to compare their features, prices, and specifications side by side.
        </p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-dark-100 dark:border-dark-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
            <Scale className="text-primary-600" /> Compare Products
          </h1>
          <p className="text-dark-500 dark:text-dark-400 text-sm mt-1">
            Side-by-side comparison of {compareList.length} selected item{compareList.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearCompare} className="btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs py-2 px-3">
            <Trash2 size={14} className="mr-1 inline" /> Clear All
          </button>
          <Link to="/products" className="btn-primary text-xs py-2 px-3">
            + Add More
          </Link>
        </div>
      </div>

      {/* Comparison Grid/Table */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-4 bg-dark-50 dark:bg-dark-800/50 text-xs uppercase text-dark-400 w-48 font-semibold rounded-tl-xl">
                Feature
              </th>
              {compareList.map((item) => (
                <th key={item.id} className="p-4 bg-white dark:bg-dark-900 border-l border-dark-100 dark:border-dark-800 min-w-[220px]">
                  <div className="relative group text-center">
                    <button
                      onClick={() => removeFromCompare(item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 hover:bg-red-200 rounded-full flex items-center justify-center text-xs transition-colors"
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>
                    <img
                      src={item.thumbnailUrl || item.images?.[0]}
                      alt={item.name}
                      className="w-32 h-32 object-contain mx-auto mb-3 rounded-lg bg-dark-50 dark:bg-dark-800 p-2"
                    />
                    <Link
                      to={`/products/${item.slug || item.id}`}
                      className="font-bold text-sm text-dark-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 block mb-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-lg font-black text-primary-600 dark:text-primary-400 mb-3">
                      ₹{item.price?.toLocaleString()}
                    </p>
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100 dark:divide-dark-800 text-sm">
            {/* Brand */}
            <tr>
              <td className="p-4 font-semibold text-dark-700 dark:text-dark-300 bg-dark-50/50 dark:bg-dark-800/30">
                Brand
              </td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 text-dark-800 dark:text-dark-200 border-l border-dark-100 dark:border-dark-800">
                  {item.brand || 'Generic'}
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td className="p-4 font-semibold text-dark-700 dark:text-dark-300 bg-dark-50/50 dark:bg-dark-800/30">
                Category
              </td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 text-dark-800 dark:text-dark-200 border-l border-dark-100 dark:border-dark-800">
                  {item.categoryName || 'General'}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="p-4 font-semibold text-dark-700 dark:text-dark-300 bg-dark-50/50 dark:bg-dark-800/30">
                Rating
              </td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 border-l border-dark-100 dark:border-dark-800">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star size={16} fill="currentColor" /> {item.avgRating || 4.5}
                    <span className="text-xs text-dark-400 font-normal">({item.reviewCount || 10} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Stock Status */}
            <tr>
              <td className="p-4 font-semibold text-dark-700 dark:text-dark-300 bg-dark-50/50 dark:bg-dark-800/30">
                Stock Status
              </td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 border-l border-dark-100 dark:border-dark-800">
                  {item.inStock !== false ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-xs px-2.5 py-1 rounded-full font-medium">
                      <Check size={12} /> In Stock ({item.stockQuantity ?? 15})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-950/40 text-xs px-2.5 py-1 rounded-full font-medium">
                      <X size={12} /> Out of Stock
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Discount */}
            <tr>
              <td className="p-4 font-semibold text-dark-700 dark:text-dark-300 bg-dark-50/50 dark:bg-dark-800/30">
                Discount
              </td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 text-dark-800 dark:text-dark-200 border-l border-dark-100 dark:border-dark-800">
                  {item.discountPercent ? `${item.discountPercent}% OFF` : 'None'}
                </td>
              ))}
            </tr>

            {/* Description */}
            <tr>
              <td className="p-4 font-semibold text-dark-700 dark:text-dark-300 bg-dark-50/50 dark:bg-dark-800/30">
                Key Features
              </td>
              {compareList.map((item) => (
                <td key={item.id} className="p-4 text-xs text-dark-600 dark:text-dark-400 border-l border-dark-100 dark:border-dark-800 leading-relaxed">
                  {item.shortDescription || item.description || 'N/A'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
