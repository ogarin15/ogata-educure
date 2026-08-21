// Post型

type Post = {
  id: number;
  title: string;
  tags: string[];
  viewCount: number;
};

// pluck

function pluck<T, K extends keyof T>(
  items: T[],
  key: K
): T[K][] {
  return items.map((item) => item[key]);
}

// findBy

function findBy<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T | undefined {
  return items.find((item) => item[key] === value);
}

// sortBy

function sortBy<
  T,
  K extends keyof T
>(
  items: T[],
  key: K
): T[] {
  return [...items].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (
      typeof valueA === "string" &&
      typeof valueB === "string"
    ) {
      return valueA.localeCompare(valueB);
    }

    if (
      typeof valueA === "number" &&
      typeof valueB === "number"
    ) {
      return valueA - valueB;
    }

    return 0;
  });
}

// サンプルデータ

const posts: Post[] = [
  {
    id: 3,
    title: "TypeScript 入門",
    tags: ["ts"],
    viewCount: 100,
  },
  {
    id: 1,
    title: "React 入門",
    tags: ["react"],
    viewCount: 50,
  },
  {
    id: 2,
    title: "Node.js 入門",
    tags: ["node"],
    viewCount: 200,
  },
];

// 実行

console.log(
  "タイトル一覧:",
  pluck(posts, "title")
);

console.log(
  "ID=2の記事:",
  findBy(posts, "id", 2)?.title
);

console.log(
  "タイトル昇順:",
  sortBy(posts, "title").map(
    (post) => post.title
  )
);

console.log(
  "閲覧数昇順:",
  sortBy(posts, "viewCount").map(
    (post) =>
      `${post.title}(${post.viewCount})`
  )
);
