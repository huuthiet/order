import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'Tên không được để trống'),
  lastName: z.string().min(1, 'Họ không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  dob: z.string().min(1, 'Ngày sinh không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  branch: z.string().min(1, 'Chi nhánh không được để trống'),
})

export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>
