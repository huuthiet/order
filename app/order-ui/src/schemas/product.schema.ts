import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.optional(z.string()),
  isLimit: z.boolean(),
  catalog: z.string().min(1, 'Danh mục không được để trống')
})

export const updateProductSchema = z.object({
  slug: z.string().min(1, 'Slug không được để trống'),
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.optional(z.string()),
  isLimit: z.boolean(),
  isActive: z.optional(z.boolean()),
  catalog: z.string().min(1, 'Danh mục không được để trống')
})

export type TCreateProductSchema = z.infer<typeof createProductSchema>
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>
