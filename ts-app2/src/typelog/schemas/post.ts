import { z } from "zod";

export const PostCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルは1文字以上で入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  body: z.string().trim().min(1, "本文は1文字以上で入力してください"),
  category: z.enum(["tech", "daily", "review", "announcement"]),
});

// JSONPlaceholder returns userId in camelCase.
export const PostResponseDtoSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string(),
  body: z.string(),
});

export type PostCreateInput = z.infer<typeof PostCreateSchema>;
export type PostCreateDraft = { [K in keyof PostCreateInput]?: string };
export type PostCreateErrors = Partial<Record<keyof PostCreateInput, string>>;
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
export type PostResponseDto = z.infer<typeof PostResponseDtoSchema>;

export function toPost(dto: PostResponseDto): Post {
  return {
    userId: dto.userId,
    id: dto.id,
    title: dto.title,
    body: dto.body,
  };
}
