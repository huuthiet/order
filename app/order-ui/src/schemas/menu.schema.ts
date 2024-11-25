import { z } from 'zod'

export const createMenuSchema = z.object({
  date: z.string(),
  branchSlug: z.string(),
})

export const updateMenuSchema = z.object({
  slug: z.string(),
  date: z.string(),
  branchSlug: z.string(),
})

export const addMenuItemSchema = z.object({
  menuSlug: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  defaultStock: z.number().min(0),
})

export const addMenuItemsSchema = z.array(
  z.object({
    menuSlug: z.string(),
    productSlug: z.string(), // Mỗi phần tử chỉ chứa 1 `productSlug`
    defaultStock: z.number().min(0),
  }),
)

export type TCreateMenuSchema = z.infer<typeof createMenuSchema>
export type TUpdateMenuSchema = z.infer<typeof updateMenuSchema>
export type TAddMenuItemSchema = z.infer<typeof addMenuItemSchema>
export type TAddMenuItemsSchema = z.infer<typeof addMenuItemsSchema>
