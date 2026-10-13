export default function ProductDetailSkeleton() {
  return (
    <div className="container-custom py-6 animate-pulse">
      <div className="skeleton h-4 w-48 rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-10 w-48 rounded" />
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
