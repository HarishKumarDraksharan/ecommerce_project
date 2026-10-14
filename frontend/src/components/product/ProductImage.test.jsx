import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProductImage, {
  getProductImageSources,
  resolveProductImageUrl,
} from './ProductImage'

describe('ProductImage', () => {
  it('prefers the thumbnail and falls back to the first product image', () => {
    expect(getProductImageSources({
      thumbnailUrl: '/uploads/thumbnail.jpg',
      images: ['/uploads/gallery.jpg'],
    })).toEqual(['/uploads/thumbnail.jpg', '/uploads/gallery.jpg'])
    expect(getProductImageSources({ images: ['/uploads/gallery.jpg'] }))
      .toEqual(['/uploads/gallery.jpg'])
  })

  it('resolves local uploads through the configured API path', () => {
    expect(resolveProductImageUrl('/uploads/item.jpg')).toBe('/api/uploads/item.jpg')
    expect(resolveProductImageUrl('https://images.example/item.jpg'))
      .toBe('https://images.example/item.jpg')
  })

  it('tries remaining sources and then uses the local fallback', () => {
    render(<ProductImage sources={['/uploads/missing.jpg', '/uploads/also-missing.jpg']} alt="Sample product" />)
    const image = screen.getByAltText('Sample product')

    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/api/uploads/also-missing.jpg')
    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/product-placeholder.svg')
  })
})
