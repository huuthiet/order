import { z } from 'zod'

export const createCatalogSchema = z.object({
  name: z.string().min(3),
  description: z.optional(z.string())
})

export type TCreateCatalogSchema = z.infer<typeof createCatalogSchema>
