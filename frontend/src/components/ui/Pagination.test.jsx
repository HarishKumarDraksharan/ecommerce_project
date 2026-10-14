import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('disables the previous button on the first page and changes to the selected page', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination
        currentPage={0}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('disables the next button on the last page and allows moving back', () => {
    const onPageChange = vi.fn()

    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons[buttons.length - 1]).toBeDisabled()

    fireEvent.click(buttons[0])
    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})
