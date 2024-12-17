import { z } from 'zod'

export const updateSystemConfigSchema = z.object({
  slug: z.string(),
  key: z.string(),
  value: z.string(),
  description: z.optional(z.string()),
})
export type TUpdateSystemConfigSchema = z.infer<typeof updateSystemConfigSchema>
