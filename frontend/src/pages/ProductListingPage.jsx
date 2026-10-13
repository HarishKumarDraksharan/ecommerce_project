import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react'
import { productAPI, categoryAPI } from '@services/api'
import ProductCard from '@components/product/ProductCard'
import ProductCardSkeleton from '@components/product/ProductCardSkeleton'
import FilterSidebar from '@components/product/FilterSidebar'
import Pagination from '@components/ui/Pagination'

const SORT_OPTIONS = [
  { value: 'createdAt,desc',      label: 'Newest First' },
  { value: 'price,asc',           label: 'Price: Low to High' },
  { value: 'price,desc',          label: 'Price: High to Low' },
  { value: 'avgRating,desc',      label: 'Top Rated' },
  { value: 'totalSold,desc',      label: 'Best Selling' },
  { value: 'name,asc',            label: 'Name: A-Z' },
]

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [viewMode, setViewMode]         = useState('grid')

  const page      = parseInt(searchParams.get('page') || '0')
  const sortParam = searchParams.get('sort') || 'createdAt,desc'
  const category  = searchParams.get('category') || ''
  const brand     = searchParams.get('brand') || ''
  const minPrice  = searchParams.get('minPrice') || ''
  const maxPrice  = searchParams.get('maxPrice') || ''
  const q         = searchParams.get('q') || ''

  const [sortBy, sortDir] = sortParam.split(',')

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { page, sortBy, sortDir, category, brand, minPrice, maxPrice, q }],
    queryFn: () => q
      ? productAPI.search({ q, page, size: 12, sortBy, sortDir })
      : productAPI.getAll({ page, size: 12, sortBy, sortDir }),
    keepPreviousData: true,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryAPI.getAll,
    staleTime: Infinity,
  })

  const products   = productsData?.content || []
  const totalPages = productsData?.totalPages || 0
  const totalItems = productsData?.totalElements || 0

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <div className="container-custom py-6">

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              {q ? `Results for "${q}"` : 'All Products'}
            </h1>
            <p className="text-dark-500 dark:text-dark-400 text-sm mt-1">
              {isLoading ? 'Loading...' : `${totalItems.toLocaleString()} products found`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative hidden md:block">
              <select
                value={sortParam}
                onChange={e => updateParam('sort', e.target.value)}
                className="input pr-10 text-sm appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-dark-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex border border-dark-200 dark:border-dark-700 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-dark-800 text-dark-500'}`}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-dark-800 text-dark-500'}`}>
                <List size={16} />
              </button>
            </div>

            {/* Filter Button (mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden btn btn-secondary gap-2 text-sm"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* ── Filter Sidebar ─────────────────────────── */}
          <FilterSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            categories={categoriesData?.data || []}
            filters={{ category, brand, minPrice, maxPrice }}
            onFilterChange={updateParam}
          />

          {/* ── Product Grid ────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">No products found</h3>
                <p className="text-dark-500 mb-6">Try different filters or search terms</p>
                <button onClick={() => setSearchParams({})} className="btn-outline">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} listView={viewMode === 'list'} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={p => {
                  const params = new URLSearchParams(searchParams)
                  params.set('page', p)
                  setSearchParams(params)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
