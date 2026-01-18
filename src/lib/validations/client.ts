import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  company: z.string().max(100, 'Company name is too long').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
  address: z.string().max(500, 'Address is too long').optional().or(z.literal('')),
})

export type ClientFormData = z.infer<typeof clientSchema>