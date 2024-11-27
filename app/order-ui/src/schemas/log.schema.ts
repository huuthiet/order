import { z } from 'zod'

export const logDetailSchema = z.object({
  id: z.string(),
  level: z.string(),
  message: z.string(),
  context: z.string(),
  timestamp: z.string(),
  pid: z.number(),
})

export type TLogDetailSchema = z.infer<typeof logDetailSchema>
