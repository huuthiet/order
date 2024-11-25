import { z } from 'zod'

export const createTableSchema = z.object({
  name: z.string().min(1),
  branch: z.string().min(1),
  location: z.string().min(1),
})

export const updateTableSchema = z.object({
  slug: z.string(),
  name: z.string().min(1),
})

export type TCreateTableSchema = z.infer<typeof createTableSchema>
export type TUpdateTableSchema = z.infer<typeof updateTableSchema>
