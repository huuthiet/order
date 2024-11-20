import { z } from 'zod'

export const createSizeSchema = z.object({
  name: z.string().min(1),
  description: z.optional(z.string())
})

export const updateSizeSchema = z.object({
  slug: z.string(),
  name: z.string().min(1),
  description: z.optional(z.string())
})

export type TCreateSizeSchema = z.infer<typeof createSizeSchema>
export type TUpdateSizeSchema = z.infer<typeof updateSizeSchema>
