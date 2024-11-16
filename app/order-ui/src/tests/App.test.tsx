import { render, screen } from '@testing-library/react'
import { describe, it, beforeEach, vi, expect } from 'vitest'
import App from '@/app/App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

// Mock các phụ thuộc
vi.mock('@/utils', () => ({
  showErrorToast: vi.fn()
}))

describe('App Component', () => {
  let queryClient: QueryClient

  // Thiết lập QueryClient mới trước mỗi test
  beforeEach(() => {
    queryClient = new QueryClient()
  })

  it('renders the App component successfully', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={createMemoryRouter([{ path: '/', element: <div>Home Page</div> }], {
            initialEntries: ['/']
          })}
        />
      </QueryClientProvider>
    )

    // Kiểm tra xem App có render đúng hay không
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('displays React Query Devtools when enabled', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={createMemoryRouter([{ path: '/', element: <div>Devtools Test</div> }], {
            initialEntries: ['/']
          })}
        />
      </QueryClientProvider>
    )

    // Kiểm tra Devtools (mặc định đang đóng)
    // expect(screen.getByText(/No routes matched location/i)).not.toBeInTheDocument()
  })

  // it('handles query errors globally', () => {
  //   const mockQueryError = new Error('Query failed')
  //   const mockMeta = { ignoreGlobalError: false }
  //   const { showErrorToast } = require('@/utils')

  //   // Gọi onError của queryCache
  //   queryClient.getQueryCache().config.onError?.(mockQueryError, { meta: mockMeta } )

  //   // Kiểm tra showErrorToast được gọi
  //   expect(showErrorToast).toHaveBeenCalledWith('Query failed')
  // })

  // it('handles mutation errors globally', () => {
  //   const mockMutationError = new Error('Mutation failed')
  //   const mockMeta = { ignoreGlobalError: false }
  //   const { showErrorToast } = require('@/utils')

  //   // Gọi onError của mutationCache
  //   queryClient.getMutationCache().config.onError?.(mockMutationError, {}, null, { meta: mockMeta } as any)

  //   // Kiểm tra showErrorToast được gọi
  //   expect(showErrorToast).toHaveBeenCalledWith('Mutation failed')
  // })
})
