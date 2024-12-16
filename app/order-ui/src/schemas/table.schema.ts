import { TableStatus } from '@/constants'
import { z } from 'zod'

export const createTableSchema = z.object({
  name: z.string().min(1),
  branch: z.string().min(1),
  location: z.string().min(1),
  // isEmpty: z.boolean(),
  status: z.enum([TableStatus.AVAILABLE, TableStatus.RESERVED]),
  xPosition: z.optional(z.number()),
  yPosition: z.optional(z.number()),
})

export const updateTableSchema = z.object({
  slug: z.string(),
  name: z.string().min(1),
  location: z.string().min(1),
})

export type TCreateTableSchema = z.infer<typeof createTableSchema>
export type TUpdateTableSchema = z.infer<typeof updateTableSchema>
