import { z } from "zod";

const BookBodySchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  publishedYear: z.number().int().min(1000).max(3000)
});
const EmptySchema = z.object({});

export const CreateBookSchema = z.object({ body: BookBodySchema, params: EmptySchema, query: EmptySchema });
export const ReplaceBookSchema = CreateBookSchema;
export const UpdateBookSchema = z.object({
  body: BookBodySchema.partial().refine(v => Object.keys(v).length > 0, "PATCHでは1つ以上の項目を指定してください"),
  params: z.object({ id: z.string().min(1) }),
  query: EmptySchema
});
export const ListBooksSchema = z.object({
  body: EmptySchema,
  params: EmptySchema,
  query: z.object({ author: z.string().optional(), limit: z.coerce.number().int().min(1).max(100).optional() })
});
export const BookIdSchema = z.object({
  body: EmptySchema, params: z.object({ id: z.string().min(1) }), query: EmptySchema
});
export type CreateBookBody = z.infer<typeof CreateBookSchema>["body"];
export type ReplaceBookBody = z.infer<typeof ReplaceBookSchema>["body"];
export type UpdateBookBody = z.infer<typeof UpdateBookSchema>["body"];
export type ListBooksQuery = z.infer<typeof ListBooksSchema>["query"];
