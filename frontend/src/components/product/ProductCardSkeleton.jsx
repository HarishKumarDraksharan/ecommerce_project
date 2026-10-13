/** Skeleton loader for ProductCard */
export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-24 rounded" />
      </div>
    </div>
  )
}
