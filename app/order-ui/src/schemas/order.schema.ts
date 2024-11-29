import { z } from 'zod'

export const createOrderTrackingByStaffSchema = z.object({
  type: z.string(),
  trackingOrderItems: z.array(
    z.object({
      quantity: z.number().int().positive(),
      orderItem: z.string(),
    }),
  ),
  productName: z.array(z.string()),
  productQuantity: z.array(z.number().int().positive()),
})

export type TCreateOrderTrackingByStaffSchema = z.infer<
  typeof createOrderTrackingByStaffSchema
>
