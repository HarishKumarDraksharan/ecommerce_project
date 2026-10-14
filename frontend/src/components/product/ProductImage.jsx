import { useEffect, useMemo, useState } from 'react'

const FALLBACK_IMAGE = '/product-placeholder.svg'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export function getProductImageSources(product) {
  const images = Array.isArray(product?.images) ? product.images : []
  return [...new Set([product?.thumbnailUrl, ...images]
    .filter(source => typeof source === 'string' && source.trim()))]
}

export function resolveProductImageUrl(source) {
  if (source.startsWith('/uploads/')) {
    return `${API_BASE_URL.replace(/\/+$/, '')}${source}`
  }
  if (source.startsWith('/api/uploads/')) {
    const apiOrigin = API_BASE_URL.match(/^https?:\/\/[^/]+/)?.[0] || ''
    return `${apiOrigin}${source}`
  }
  return source
}

export default function ProductImage({ sources = [], ...imageProps }) {
  const sourceKey = sources.filter(Boolean).join('\u0000')
  const candidates = useMemo(
    () => sourceKey.split('\u0000').filter(Boolean).map(resolveProductImageUrl),
    [sourceKey]
  )
  const [failedSourceCount, setFailedSourceCount] = useState(0)

  useEffect(() => {
    setFailedSourceCount(0)
  }, [sourceKey])

  const src = candidates[failedSourceCount] || FALLBACK_IMAGE

  return (
    <img
      {...imageProps}
      src={src}
      onError={() => setFailedSourceCount(count => Math.min(count + 1, candidates.length))}
    />
  )
}
