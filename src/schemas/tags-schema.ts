import { z } from "zod";

export const tagColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
  "gray",
] as const;

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(24),
  color: z.enum(tagColors),
});

export type Tag = z.infer<typeof tagSchema>;

export const tagsSchema = z.array(tagSchema);
