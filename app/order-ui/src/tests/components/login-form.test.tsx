// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { LoginForm } from '@/components/app/form'
// import { useLogin, useProfile } from '@/hooks'
// import { describe, it, expect, beforeEach, vi } from 'vitest'
// import { Role, ROUTE } from '@/constants'

// // Mock hooks
// vi.mock('@/hooks', () => ({
//     useLogin: vi.fn(),
//     useProfile: vi.fn()
// }))

// // Mock stores
// vi.mock('@/stores', () => ({
//     useAuthStore: () => ({
//         setToken: vi.fn(),
//         setRefreshToken: vi.fn(),
//         setExpireTime: vi.fn(),
//         setExpireTimeRefreshToken: vi.fn()
//     }),
//     useUserStore: () => ({
//         setUserInfo: vi.fn()
//     }),
//     useCurrentUrlStore: () => ({
//         currentUrl: '',
//         clearUrl: vi.fn()
//     })
// }))

// // Mock translations
// vi.mock('react-i18next', () => ({
//     useTranslation: () => ({
//         t: (key: string) => {
//             const translations: Record<string, string> = {
//                 'login.phoneNumber': 'Số điện thoại',
//                 'login.password': 'Mật khẩu',
//                 'login.enterPhoneNumber': 'Nhập số điện thoại',
//                 'login.enterPassword': 'Nhập mật khẩu',
//                 'toast.loginSuccess': 'Đăng nhập thành công',
//             }
//             return translations[key] || key
//         }
//     })
// }))

// // Mock react-router-dom
// vi.mock('react-router-dom', () => ({
//     useNavigate: () => vi.fn()
// }))

// describe('LoginForm', () => {
//     const queryClient = new QueryClient()
//     const mockLoginResponse = {
//         result: {
//             accessToken: 'test-token',
//             refreshToken: 'test-refresh-token',
//             expireTime: '2024-01-01',
//             expireTimeRefreshToken: '2024-01-02'
//         }
//     }

//     const mockProfileResponse = {
//         result: {
//             id: '1',
//             firstName: 'John',
//             lastName: 'Doe',
//             role: {
//                 name: Role.STAFF
//             }
//         }
//     }

//     beforeEach(() => {
//         // Mock useLogin hook
//         (useLogin as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//             mutate: vi.fn((_, { onSuccess }) => onSuccess(mockLoginResponse)),
//             isPending: false
//         });

//         // Mock useProfile hook
//         (useProfile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//             refetch: vi.fn().mockResolvedValue({ data: mockProfileResponse })
//         })
//     })

//     it('renders the login form', () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <LoginForm />
//             </QueryClientProvider>
//         )

//         expect(screen.getByPlaceholderText('Nhập số điện thoại')).toBeInTheDocument()
//         expect(screen.getByPlaceholderText('Nhập mật khẩu')).toBeInTheDocument()
//     })

//     it('allows user to enter credentials and submit', async () => {
//         const loginMock = vi.fn()
//             ; (useLogin as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//                 mutate: loginMock,
//                 isPending: false
//             })

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <LoginForm />
//             </QueryClientProvider>
//         )

//         const phoneInput = screen.getByPlaceholderText('Nhập số điện thoại')
//         const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu')

//         fireEvent.change(phoneInput, { target: { value: '0123456789' } })
//         fireEvent.change(passwordInput, { target: { value: 'password123' } })

//         // Fix: Use name option instead of type
//         const submitButton = screen.getByRole('button', { name: /submit|login|đăng nhập/i })
//         fireEvent.click(submitButton)

//         await waitFor(() => {
//             expect(loginMock).toHaveBeenCalledWith(
//                 {
//                     phonenumber: '0123456789',
//                     password: 'password123'
//                 },
//                 expect.any(Object)
//             )
//         })
//     })

//     it('disables submit button when form is submitting', () => {
//         (useLogin as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//             mutate: vi.fn(),
//             isPending: true
//         })

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <LoginForm />
//             </QueryClientProvider>
//         )

//         // Fix: Use name option instead of type
//         const submitButton = screen.getByRole('button', { name: /submit|login|đăng nhập/i })
//         expect(submitButton).toBeDisabled()
//     })

//     it('shows validation errors for empty fields', async () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <LoginForm />
//             </QueryClientProvider>
//         )

//         // Fix: Use name option instead of type
//         const submitButton = screen.getByRole('button', { name: /submit|login|đăng nhập/i })
//         fireEvent.click(submitButton)

//         await waitFor(() => {
//             expect(screen.getByText('Số điện thoại là bắt buộc')).toBeInTheDocument()
//             expect(screen.getByText('Mật khẩu là bắt buộc')).toBeInTheDocument()
//         })
//     })
// })
