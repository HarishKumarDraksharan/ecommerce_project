// FilterSidebar – Product filters for listing page
import { X } from 'lucide-react'

export default function FilterSidebar({ open, onClose, categories = [], filters = {}, onFilterChange }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 flex-shrink-0 hidden md:block
        ${open ? 'fixed inset-y-0 left-0 z-50 flex md:relative md:z-auto bg-white dark:bg-dark-900 shadow-xl md:shadow-none' : ''}
      `}>
        <div className="card p-4 sticky top-24">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="font-bold dark:text-white">Filters</h2>
            <button onClick={onClose}><X size={18} /></button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm dark:text-white mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={filters.category === String(cat.id)}
                    onChange={() => onFilterChange('category', cat.id)}
                    className="text-primary-500 w-4 h-4"
                  />
                  <span className="text-sm text-dark-600 dark:text-dark-300 group-hover:text-primary-500 transition-colors">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm dark:text-white mb-3">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice}
                onChange={e => onFilterChange('minPrice', e.target.value)}
                className="input text-xs"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice}
                onChange={e => onFilterChange('maxPrice', e.target.value)}
                className="input text-xs"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => { onFilterChange('category', ''); onFilterChange('minPrice', ''); onFilterChange('maxPrice', '') }}
            className="btn-ghost w-full text-sm justify-center border border-dark-200 dark:border-dark-700"
          >
            Clear All Filters
          </button>
        </div>
      </aside>
    </>
  )
}
