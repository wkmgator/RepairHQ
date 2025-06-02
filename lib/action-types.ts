export type Action = (formData: FormData) => Promise<{
  success: boolean
  message: string
}>
