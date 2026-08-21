import type {
  FeedPost,
  FeedCard,
} from "./types";

import { CATEGORY } from "./constants";

import {
  isPublished,
  isPopular,
} from "./guards";

import { groupBy, sortByDesc } from "./utils";

const posts: FeedPost[] = [
  {
    id: 1,
    author: {
      id: 1,
      username: "@alice",
      nickname: "Alice",
    },
    title: "TypeScript 完全入門",
    body: "TypeScriptの基本をわかりやすく解説します。",
    category: CATEGORY.Tech,
    tags: ["typescript", "programming"],
    publishedAt: new Date("2024-01-10"),
    viewCount: 250,
  },
  {
    id: 2,
    author: {
      id: 2,
      username: "@bob",
      nickname: "Bob",
    },
    title: "最近読んだ技術書10冊",
    body: "最近読んだおすすめの技術書を紹介します。",
    category: CATEGORY.Review,
    tags: ["book", "review"],
    publishedAt: new Date("2024-02-01"),
    viewCount: 180,
  },
  {
    id: 3,
    author: {
      id: 3,
      username: "@carol",
      nickname: "Carol",
    },
    title: "v2.0 リリース",
    body: "TypeLog v2.0をリリースしました。",
    category: CATEGORY.Announcement,
    tags: ["release"],
    publishedAt: new Date("2024-03-01"),
    viewCount: 150,
  },
  {
    id: 4,
    author: {
      id: 4,
      username: "@dave",
      nickname: "Dave",
    },
    title: "今日のランチ",
    body: "今日食べたランチを紹介します。",
    category: CATEGORY.Daily,
    tags: ["lunch", "daily"],
    publishedAt: new Date("2024-03-10"),
    viewCount: 80,
  },
  {
    id: 5,
    author: {
      id: 1,
      username: "@alice",
      nickname: "Alice",
    },
    title: "React Hooks まとめ",
    body: "React Hooksについてまとめました。",
    category: CATEGORY.Tech,
    tags: ["react", "hooks"],
    publishedAt: new Date("2024-04-01"),
    viewCount: 120,
  },
  {
    id: 6,
    author: {
      id: 2,
      username: "@bob",
      nickname: "Bob",
    },
    title: "これから公開する記事",
    body: "まだ公開されていない記事です。",
    category: CATEGORY.Tech,
    tags: ["draft"],
    publishedAt: new Date("2099-01-01"),
    viewCount: 300,
  },
];

const publishedPosts = posts.filter(isPublished);

const topPosts = sortByDesc(
  publishedPosts,
  (post) => post.viewCount
).slice(0, 3);

const groupedPosts = groupBy(
  publishedPosts,
  (post) => post.category
);

const topCards: FeedCard[] = topPosts.map(
  (post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    category: post.category,
    publishedAt: post.publishedAt,
  })
);

const popularCount = posts.filter(isPopular).length;

console.log("=== TypeLog トップページ ===");

console.log("おすすめ記事 TOP3:");

topCards.forEach((card) => {
  console.log(
    `[${card.category}] ${card.title} by ${card.author.username}`
  );
});

console.log("カテゴリ別記事数:");

Object.entries(groupedPosts).forEach(
  ([category, categoryPosts]) => {
    console.log(
      `${category}:${categoryPosts.length}件`
    );
  }
);

console.log(
  `人気記事（閲覧数100以上）:${popularCount}件`
);
