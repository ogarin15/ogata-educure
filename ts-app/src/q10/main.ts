import type {
  FeedPost,
  FeedCard,
} from "./types";

import { CATEGORY } from "./constants";

import {
  isPublished,
  isPopular,
} from "./guards";

import type {
  FeedAggregate,
} from "./guards";

import {
  groupBy,
  sortByDesc,
} from "./utils";

// サンプルデータ
const posts: FeedPost[] = [
  {
    id: 1,
    author: {
      id: 1,
      username: "alice",
      nickname: "Alice",
    },
    title: "TypeScript 完全入門",
    body: "TypeScriptの基礎から学ぶ記事です。",
    category: CATEGORY.tech,
    tags: ["TypeScript", "JavaScript"],
    publishedAt: new Date("2024-01-01"),
    viewCount: 250,
  },
  {
    id: 2,
    author: {
      id: 2,
      username: "bob",
      nickname: "Bob",
    },
    title: "最近読んだ技術書10冊",
    body: "おすすめの技術書を紹介します。",
    category: CATEGORY.review,
    tags: ["本", "レビュー"],
    publishedAt: new Date("2024-01-05"),
    viewCount: 180,
  },
  {
    id: 3,
    author: {
      id: 3,
      username: "carol",
      nickname: "Carol",
    },
    title: "v2.0 リリース",
    body: "新バージョンをリリースしました。",
    category: CATEGORY.announcement,
    tags: ["リリース", "ニュース"],
    publishedAt: new Date("2024-01-10"),
    viewCount: 150,
  },
  {
    id: 4,
    author: {
      id: 1,
      username: "alice",
      nickname: "Alice",
    },
    title: "毎日の学習記録",
    body: "今日の学習内容を記録します。",
    category: CATEGORY.daily,
    tags: ["日記", "学習"],
    publishedAt: new Date("2024-01-15"),
    viewCount: 80,
  },
  {
    id: 5,
    author: {
      id: 2,
      username: "bob",
      nickname: "Bob",
    },
    title: "TypeScript Utility Types",
    body: "Utility Typesについて解説します。",
    category: CATEGORY.tech,
    tags: ["TypeScript", "Utility Types"],
    publishedAt: new Date("2024-01-20"),
    viewCount: 120,
  },
  {
    id: 6,
    author: {
      id: 3,
      username: "carol",
      nickname: "Carol",
    },
    title: "未来の記事",
    body: "まだ公開されていない記事です。",
    category: CATEGORY.daily,
    tags: ["未来"],
    publishedAt: new Date("2099-01-01"),
    viewCount: 500,
  },
];

// ① 公開済みの記事だけに絞り込む
const publishedPosts = posts.filter(isPublished);

// ② 閲覧数の降順に並べてTOP3を取得
const topPosts = sortByDesc(
  publishedPosts,
  (post) => post.viewCount
).slice(0, 3);

// ③ カテゴリごとにグループ化
const groupedPosts = groupBy(
  publishedPosts,
  (post) => post.category
);

// ④ TOP3をFeedCardに変換
const feedCards: FeedCard[] = topPosts.map(
  (post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    category: post.category,
    publishedAt: post.publishedAt,
  })
);

// FeedAggregateのサンプル
const aggregate: FeedAggregate =
  feedCards.length > 0
    ? {
        status: "success",
        total: publishedPosts.length,
        count: feedCards.length,
        topCategory: feedCards[0].category,
      }
    : {
        status: "empty",
        total: 0,
        count: 0,
        topCategory: null,
      };

// Console出力
console.log("==== TypeLog トップページ ====");

console.log("おすすめ記事 TOP3:");

feedCards.forEach((card) => {
  console.log(
    `[${card.category}] ${card.title} by @${card.author.username}`
  );
});

console.log("カテゴリ別記事数:");

Object.entries(groupedPosts).forEach(
  ([category, categoryPosts]) => {
    console.log(
      `${category}: ${categoryPosts.length}件`
    );
  }
);

const popularCount = publishedPosts.filter(
  isPopular
).length;

console.log(
  `人気記事(閲覧数100以上): ${popularCount}件`
);

console.log("集計結果:", aggregate);