type Post = {
  readonly id: number;
  readonly authorId: number;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
  readonly createdAt: Date;
};

// タイトルを変更する
function editTitle(post: Post, newTitle: string): Post {
  return {
    ...post,
    title: newTitle,
  };
}

// タグを追加する
function addTag(post: Post, newTag: string): Post {
  return {
    ...post,
    tags: [...post.tags, newTag],
  };
}

// 本文の合計文字数を求める
function totalBodyLength(posts: readonly Post[]): number {
  return posts.reduce((sum, post) => {
    return sum + post.body.length;
  }, 0);
}

// 元の記事

const original: Post = {
  id: 1,
  authorId: 100,
  title: "はじめての投稿",
  body: "こんにちは、TypeLog!",
  tags: ["hello", "intro"],
  createdAt: new Date(),
};

// 新しい記事を生成

const edited: Post = editTitle(
  original,
  "改訂版:はじめての投稿"
);

const tagged: Post = addTag(
  edited,
  "typescript"
);

// ログ出力

console.log(original.title);

console.log(edited.title);

console.log(original.tags.length);

console.log(tagged.tags);

console.log(
  totalBodyLength([
    original,
    edited,
    tagged,
  ])
);
