import { Star } from 'lucide-react'

export default function RatingStars({ rating = 0, size = 14, showEmpty = true }) {
  const filled  = Math.floor(rating)
  const partial = rating - filled
  const empty   = 5 - filled - (partial > 0 ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {/* Filled stars */}
      {Array(filled).fill(0).map((_, i) => (
        <Star key={`f${i}`} size={size} className="text-amber-400 fill-amber-400" />
      ))}
      {/* Partial star */}
      {partial > 0 && (
        <div className="relative">
          <Star size={size} className="text-dark-200 dark:text-dark-600 fill-dark-200 dark:fill-dark-600" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${partial * 100}%` }}>
            <Star size={size} className="text-amber-400 fill-amber-400" />
          </div>
        </div>
      )}
      {/* Empty stars */}
      {showEmpty && Array(empty).fill(0).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-dark-200 dark:text-dark-600" />
      ))}
    </div>
  )
}
