import { z } from 'zod'

export const anamnesisSchema = z.object({
  title: z.string(),
  description: z.string(),
  created_date: z.string(),
})

export type Anamnesis = z.infer<typeof anamnesisSchema>
