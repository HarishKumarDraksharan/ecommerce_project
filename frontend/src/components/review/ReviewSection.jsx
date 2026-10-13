import { useQuery } from '@tanstack/react-query'
import { reviewAPI } from '@services/api'
import RatingStars from '@components/ui/RatingStars'
import { MessageSquare } from 'lucide-react'

export default function ReviewSection({ productId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewAPI.getByProduct(productId, { page: 0, size: 10 }),
    enabled: !!productId,
  })

  const reviews = data?.content || []
  const total   = data?.totalElements || 0

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={22} className="text-primary-500" />
        <h2 className="text-xl font-bold dark:text-white">Customer Reviews</h2>
        <span className="badge badge-primary">{total}</span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-dark-400">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm dark:text-white">{review.userName || 'Verified Buyer'}</p>
                  <RatingStars rating={review.rating} size={13} />
                </div>
                <span className="text-xs text-dark-400">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              {review.title && <p className="font-medium text-sm dark:text-white mb-1">{review.title}</p>}
              <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
