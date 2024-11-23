import { z } from 'zod'

export const createMenuSchema = z.object({
  date: z.string(),
  branchSlug: z.string(),
})

export type TCreateMenuSchema = z.infer<typeof createMenuSchema>
