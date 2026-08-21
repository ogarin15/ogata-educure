// Post型

type Post = {
  id: number;
  authorId: number;
  title: string;
  body: string;
  tags: readonly string[];
  createdAt: Date;
};

// first

function first<T>(items: T[]): T | undefined {
  return items[0];
}

// last

function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

// tap

function tap<T>(value: T, fn: (value: T) => void): T {
  fn(value);
  return value;
}

// swap

function swap<A, B>(pair: [A, B]): [B, A] {
  return [pair[1], pair[0]];
}

// サンプルデータ

const posts: Post[] = [
  {
    id: 1,
    authorId: 100,
    title: "最古の記事",
    body: "こんにちは",
    tags: ["typescript"],
    createdAt: new Date(),
  },
  {
    id: 2,
    authorId: 101,
    title: "中間の記事",
    body: "おはよう",
    tags: ["javascript"],
    createdAt: new Date(),
  },
  {
    id: 3,
    authorId: 102,
    title: "最新の記事",
    body: "こんばんは",
    tags: ["nodejs"],
    createdAt: new Date(),
  },
];

const emptyPosts: Post[] = [];

const numbers = [1, 2, 3];

const pair: [string, number] = ["hello", 42];

// 実行

console.log("最古:", first(posts)?.title);

console.log("最新:", last(posts)?.title);

console.log("空配列の先頭:", first(emptyPosts));

const doubled = tap(numbers, (value) => {
  console.log("加工前:", value);
}).map((n) => n * 2);

console.log("加工後:", doubled);

console.log("入れ替え:", swap(pair));
