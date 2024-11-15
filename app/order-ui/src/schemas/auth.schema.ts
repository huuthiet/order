import * as z from 'zod'

// import { PHONE_NUMBER_REGEX } from '@/constants'

export const loginSchema = z.object({
  // phoneNumber: z.string().min(10).max(10).regex(PHONE_NUMBER_REGEX, 'login.phoneNumberInvalid'),
  phonenumber: z.string(),
  password: z.string().min(6)
})
