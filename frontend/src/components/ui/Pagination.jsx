import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i
    if (currentPage < 4) return i
    if (currentPage > totalPages - 4) return totalPages - 7 + i
    return currentPage - 3 + i
  })

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="btn-icon btn-ghost disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all
                      ${p === currentPage
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-dark-700'
                      }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="btn-icon btn-ghost disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
