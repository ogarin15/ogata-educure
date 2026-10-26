import type { PostCreateInput, Post } from "@/typelog/schemas/post";
import { PostResponseDtoSchema, toPost } from "@/typelog/schemas/post";
import type { ApiResult } from "@/typelog/errors";

type SafeParseSchema<T> = {
  safeParse(value: unknown):
    | { success: true; data: T }
    | { success: false; error: { message: string } };
};

/** HTTP・JSON・スキーマ検証の失敗を例外にせず ApiResult で返す */
export async function fetchJson<T>(
  url: string,
  init: RequestInit,
  schema: SafeParseSchema<T>,
): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error: unknown) {
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "ネットワーク通信に失敗しました",
      },
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: {
        code: `HTTP_${response.status}`,
        message: response.statusText || "HTTPリクエストに失敗しました",
      },
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch (error: unknown) {
    return {
      ok: false,
      error: {
        code: "JSON_ERROR",
        message: error instanceof Error ? error.message : "レスポンスをJSONとして読み取れませんでした",
      },
    };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      error: { code: "SCHEMA_ERROR", message: parsed.error.message },
    };
  }

  return { ok: true, data: parsed.data };
}

export async function submitPost(input: PostCreateInput): Promise<ApiResult<Post>> {
  const result = await fetchJson(
    "https://jsonplaceholder.typicode.com/posts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input.title,
        body: input.body,
        category: input.category,
        userId: 1,
      }),
    },
    PostResponseDtoSchema,
  );

  if (!result.ok) return result;
  return { ok: true, data: toPost(result.data) };
}
