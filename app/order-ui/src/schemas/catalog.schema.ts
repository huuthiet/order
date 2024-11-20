import { z } from 'zod'

export const createCatalogSchema = z.object({
  name: z.string().min(3),
  description: z.optional(z.string())
})

export const updateCatalogSchema = z.object({
  slug: z.string(),
  name: z.string().min(3),
  description: z.optional(z.string())
})

export type TCreateCatalogSchema = z.infer<typeof createCatalogSchema>
export type TUpdateCatalogSchema = z.infer<typeof updateCatalogSchema>
