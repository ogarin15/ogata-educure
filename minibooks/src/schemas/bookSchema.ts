import { z } from "zod";

const BookBodySchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  publishedYear: z.number().int().min(1000).max(3000),
});
const EmptySchema = z.object({}).default({});
export const CreateBookSchema = z.object({ body: BookBodySchema, params: EmptySchema, query: EmptySchema });
export const ReplaceBookSchema = z.object({ body: BookBodySchema, params: z.object({ id: z.string().min(1) }), query: EmptySchema });
export const UpdateBookSchema = z.object({
  body: BookBodySchema.partial().refine((body) => Object.keys(body).length > 0, { message: "at least one field is required" }),
  params: z.object({ id: z.string().min(1) }), query: EmptySchema,
});
export const ListBooksSchema = z.object({
  body: EmptySchema, params: EmptySchema,
  query: z.object({ author: z.string().optional(), limit: z.coerce.number().int().min(1).max(100).optional() }),
});
export const BookIdSchema = z.object({ body: EmptySchema, params: z.object({ id: z.string().min(1) }), query: EmptySchema });
export type CreateBookBody = z.infer<typeof CreateBookSchema>["body"];
