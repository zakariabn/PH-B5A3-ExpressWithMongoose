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
  title: z.string().trim(),
  author: z.string().trim(),
  genre: genreEnum,
  isbn: z.string(),
  copies: z.number().min(1),
  available: z.boolean().default(true),
  description: z.string().trim().optional(),
});

export const updateBookRequestBodyZodSchema = z.object({
  copies: z
    .number("Copies should be a number value")
    .min(1, "Copies value must be a positive number"),
});

export const bookQuerySchema = z.object({
  filter: genreEnum.optional(),
  sortBy: z.string().optional().default("createdAt"),
  // sortBy: z
  //   .enum(["title", "author", "copies", "createdAt", "updatedAt"])
  //   .optional()
  //   .default("createdAt"),
  sort: z.enum(["desc", "asc"]).optional().default("desc"), // optionally validate allowed values
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .optional()
    .default(10),
  skip: z
    .string()
    .regex(/^\d+$/, "Skip must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .optional()
    .default(0),
  page: z
    .string()
    .regex(/^\d+$/, "Skip must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .optional()
    .default(1),
});
