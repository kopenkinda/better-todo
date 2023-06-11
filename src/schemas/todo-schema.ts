import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  isCompleted: z.boolean(),
  tags: z.array(z.string()),
});

export type Todo = z.infer<typeof todoSchema>;
