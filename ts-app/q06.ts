const blogApi = {
  fetchPost: (id: number) =>
    Promise.resolve({
      id,
      title: "記事",
      body: "本文",
    }),

  fetchPostsByAuthor: (authorId: number, limit: number) =>
    Promise.resolve(
      [
        { id: 1, title: "記事1" },
        { id: 2, title: "記事2" },
      ]
        .slice(0, limit)
        .map((p) => ({ ...p, authorId }))
    ),
};

// BlogApi
type BlogApi = typeof blogApi;

// FetchPostInput
type FetchPostInput = Parameters<typeof blogApi.fetchPost>[0];

// FetchPostOutput
type FetchPostOutput = Awaited<
  ReturnType<typeof blogApi.fetchPost>
>;

// FetchPostsArgs
type FetchPostsArgs = Parameters<
  typeof blogApi.fetchPostsByAuthor
>;

// UserRole
type UserRole = "admin" | "editor" | "viewer";

// Permissions
type Permissions = Record<UserRole, boolean>;

// サンプル値

const fetchPostInput: FetchPostInput = 1;

const fetchPostsArgs: FetchPostsArgs = [42, 10];

const permissions: Permissions = {
  admin: true,
  editor: true,
  viewer: false,
};

// 動作確認
async function main(): Promise<void> {
  console.log("fetchPost 入力:", fetchPostInput);

  const post: FetchPostOutput =
    await blogApi.fetchPost(fetchPostInput);

  console.log("fetchPost 実行:", post);

  console.log("fetchPostsByAuthor 引数:", fetchPostsArgs);

  const posts = await blogApi.fetchPostsByAuthor(
    ...fetchPostsArgs
  );

  console.log("fetchPostsByAuthor 実行:", posts);

  console.log("権限マップ:", permissions);
}

main();

export {};
