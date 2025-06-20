import * as z from "zod/v4";

export const genreEnum = z.enum([
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
]);

export const bookZodSchema = z.object({
  title: z.string().min(2).trim(),
  author: z.string().min(2).trim(),
  genre: genreEnum,
  isbn: z.number().min(5),
  copies: z.number().min(1),
  available: z.boolean().default(true),
  description: z.string().optional(),
});

export const updateBookRequestBodyZodSchema = z.object({
  copies: z
    .number("Copies should be a number value")
    .min(1, "Copies value must be a positive number"),
});

export const bookQuerySchema = z.object({
  filter: z.string().optional(),
  sortBy: z.string().optional(),
  sort: z.enum(["desc", "asc"]).optional(), // optionally validate allowed values
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .optional(),
  skip: z
    .string()
    .regex(/^\d+$/, "Skip must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .optional(),
});
