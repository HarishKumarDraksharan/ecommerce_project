import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders linked ancestors and a non-linked current page', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: 'Headphones' },
          ]}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products')
    expect(screen.getByText('Headphones').tagName).toBe('SPAN')
  })
})
