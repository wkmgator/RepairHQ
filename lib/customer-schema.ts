import { z } from "zod"

export const customerFormSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100, "First name is too long"),
  last_name: z.string().min(1, "Last name is required").max(100, "Last name is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().max(20, "Phone number is too long").optional(),
  address: z.string().max(255, "Address is too long").optional(),
  city: z.string().max(100, "City name is too long").optional(),
  state: z.string().max(100, "State name is too long").optional(),
  zip_code: z.string().max(20, "Zip code is too long").optional(),
  notes: z.string().optional(),
})

export type CustomerFormData = z.infer<typeof customerFormSchema>
