import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  isCompleted: z.boolean().default(false),
  tag: z.string(),
  createdAt: z.date().optional(),
  finishedAt: z.date().optional(),
});

export const newTodoSchema = todoSchema.omit({ id: true });

export type Todo = z.infer<typeof todoSchema>;
export type NewTodo = z.infer<typeof newTodoSchema>;
