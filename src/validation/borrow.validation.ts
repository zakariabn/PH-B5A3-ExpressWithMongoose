import * as z from "zod/v4";

export const borrowBookZodSchema = z.object({
  book: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),

  // dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
  //   message: "Invalid date format",
  // }).optional,
  dueDate: z.date().optional(),
});
