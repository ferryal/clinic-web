import { z } from 'zod'

export const anamnesisSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  created_date: z.string(),
})

export type Anamnesis = z.infer<typeof anamnesisSchema>
