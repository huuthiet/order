// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { SystemConfigForm } from '../../components/app/form/system-config-form'
// import { useSystemConfigs, useCreateSystemConfig } from '@/hooks'
// import { describe, it, expect, beforeEach, vi } from 'vitest'

// // Mock the hooks
// vi.mock('@/hooks', () => ({
//   useSystemConfigs: vi.fn(),
//   useCreateSystemConfig: vi.fn(),
// }))

// // Mock translations
// vi.mock('react-i18next', () => ({
//   useTranslation: () => {
//     return {
//       t: (key: string) => {
//         const translations: Record<string, string> = {
//           'config.addNewConfig': 'Thêm cấu hình mới',
//           'config.savedConfigs': 'Cấu hình đã lưu',
//           'config.enterKey': 'Nhập khóa',
//           'config.enterValue': 'Nhập giá trị',
//           'config.save': 'Lưu',
//           'config.update': 'Cập nhật',
//           'config.delete': 'Xóa',
//           'common.action': 'Thao tác'
//         };
//         return translations[key] || key;
//       },
//       i18n: { changeLanguage: vi.fn() }
//     };
//   }
// }));

// describe('SystemConfigForm', () => {
//   const queryClient = new QueryClient()
//   const mockSystemConfigs = {
//     result: [
//       {
//         key: 'test_key',
//         value: 'test_value',
//         slug: 'test-slug',
//         description: '',
//         createdAt: new Date().toISOString(),
//       },
//     ],
//   }

//   beforeEach(() => {
//     (useSystemConfigs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//       data: mockSystemConfigs,
//     });

//     (useCreateSystemConfig as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//       mutate: vi.fn(),
//       isPending: false,
//     })
//   })

//   it('renders the form', () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <SystemConfigForm />
//       </QueryClientProvider>
//     )

//     expect(screen.getByText('Thêm cấu hình mới')).toBeInTheDocument()
//     expect(screen.getByText('Cấu hình đã lưu')).toBeInTheDocument()
//   })

//   it('allows adding new config', async () => {
//     const createMock = vi.fn();
//     (useCreateSystemConfig as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//       mutate: createMock,
//       isPending: false,
//     });

//     render(
//       <QueryClientProvider client={queryClient}>
//         <SystemConfigForm />
//       </QueryClientProvider>
//     );

//     const keyInput = screen.getByPlaceholderText('Nhập khóa');
//     const valueInput = screen.getByPlaceholderText('Nhập giá trị');

//     fireEvent.change(keyInput, { target: { value: 'new_key' } });
//     fireEvent.change(valueInput, { target: { value: 'new_value' } });

//     const saveButton = screen.getByText('Lưu');
//     fireEvent.click(saveButton);

//     await waitFor(() => {
//       expect(createMock).toHaveBeenCalled();
//     });
//   });

//   it('displays existing configs', () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <SystemConfigForm />
//       </QueryClientProvider>
//     )

//     expect(screen.getByText('test_key')).toBeInTheDocument()
//     expect(screen.getByText('test_value')).toBeInTheDocument()
//   })

//   it('disables save button when isPending is true', () => {
//     (useCreateSystemConfig as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
//       mutate: vi.fn(),
//       isPending: true,
//     });

//     render(
//       <QueryClientProvider client={queryClient}>
//         <SystemConfigForm />
//       </QueryClientProvider>
//     );

//     const saveButton = screen.getByText('Lưu');
//     expect(saveButton).toBeDisabled();
//   });
// })