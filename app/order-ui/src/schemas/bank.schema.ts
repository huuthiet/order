import { z } from 'zod'

export const createBankConnectorSchema = z.object({
  xProviderId: z.string(),
  xService: z.string(),
  xOwnerNumber: z.string(),
  xOwnerType: z.string(),
  beneficiaryName: z.string(),
  virtualAccountPrefix: z.string(),
})

export const updateBankConnectorSchema = z.object({
  slug: z.string(),
  xProviderId: z.string(),
  xService: z.string(),
  xOwnerNumber: z.string(),
  xOwnerType: z.string(),
  beneficiaryName: z.string(),
  virtualAccountPrefix: z.string(),
})

export type TCreateBankConnectorSchema = z.infer<
  typeof createBankConnectorSchema
>
export type TUpdateBankConnectorSchema = z.infer<
  typeof updateBankConnectorSchema
>
