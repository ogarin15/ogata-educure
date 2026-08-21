// CATEGORY

const CATEGORY = {
  Tech: "tech",
  Daily: "daily",
  Review: "review",
  Announcement: "announcement",
} as const;

// 型の作成

type CategoryKey = keyof typeof CATEGORY;

type CategoryValue =
  (typeof CATEGORY)[CategoryKey];

// Post型

type Post = {
  id: number;
  title: string;
  category: CategoryValue;
};

// 関数

function filterByCategory(
  posts: Post[],
  category: CategoryValue
): Post[] {
  return posts.filter(
    (post) => post.category === category
  );
}

function getCategoryValue(
  key: CategoryKey
): CategoryValue {
  return CATEGORY[key];
}

// サンプルデータ

const posts: Post[] = [
  {
    id: 1,
    title: "TS入門",
    category: "tech",
  },
  {
    id: 2,
    title: "今日のランチ",
    category: "daily",
  },
  {
    id: 3,
    title: "新機能リリース",
    category: "announcement",
  },
  {
    id: 4,
    title: "最近読んだ本",
    category: "review",
  },
  {
    id: 5,
    title: "React Hooksまとめ",
    category: "tech",
  },
];

// 動作確認

const techPosts = filterByCategory(
  posts,
  CATEGORY.Tech
);

console.log(
  "技術系:",
  techPosts.map((post) => post.title)
);

const dailyPosts = filterByCategory(
  posts,
  "daily"
);

console.log(
  "日常系:",
  dailyPosts.map((post) => post.title)
);

console.log(getCategoryValue("Tech"));

console.log(
  getCategoryValue("Announcement")
);
