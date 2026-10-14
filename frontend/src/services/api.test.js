import { describe, expect, it } from 'vitest'
import { unwrapApiResponse } from './api'

describe('unwrapApiResponse', () => {
  it('returns paginated data from the standard API response wrapper', () => {
    const page = {
      content: [{ id: 1, name: 'Product' }],
      totalElements: 39,
      totalPages: 4,
      number: 0,
      size: 12,
    }

    expect(unwrapApiResponse({ success: true, data: page })).toBe(page)
  })

  it('preserves unwrapped page responses', () => {
    const page = { content: [], totalElements: 0 }

    expect(unwrapApiResponse(page)).toBe(page)
  })
})
