// Post（真実の源）

type Post = {
  id: number;
  authorId: number;
  title: string;
  body: string;
  tags: string[];
  publishedAt: Date | null;
  viewCount: number;
};

// 派生型

// 新規作成用
type PostCreate = Omit<Post, "id" | "viewCount">;

// 更新用
type PostUpdate =
  Pick<Post, "id"> &
  Partial<Omit<Post, "id">>;

// 一覧表示用
type PostCard = Pick<
  Post,
  "id" | "title" | "publishedAt"
>;

// 公開用
type PublicPost = Readonly<
  Omit<Post, "authorId">
>;

// サンプルデータ

const create: PostCreate = {
  authorId: 1,
  title: "新規記事",
  body: "本文です",
  tags: [],
  publishedAt: null,
};

const update: PostUpdate = {
  id: 5,
  title: "タイトルだけ更新",
};

const card: PostCard = {
  id: 1,
  title: "記事タイトル",
  publishedAt: new Date(),
};

const publicPost: PublicPost = {
  id: 1,
  title: "公開用",
  body: "本文",
  tags: ["ts"],
  publishedAt: new Date(),
  viewCount: 100,
};

// ログ出力

console.log("Create:", create);

console.log("Update:", update);

console.log("Card:", card);

console.log("Public:", publicPost);
