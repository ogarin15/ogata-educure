import type { FeedPost } from "./types";

// 公開済みか判定する型ガード
export function isPublished(post: FeedPost): post is FeedPost {
  return post.publishedAt.getTime() <= Date.now();
}

// 人気記事か判定する
export function isPopular(post: FeedPost): boolean {
  return post.viewCount >= 100;
}

// フィード集計結果
export type FeedAggregate =
  | {
      status: "success";
      total: number;
      count: number;
      topCategory: string;
    }
  | {
      status: "empty";
      total: 0;
      count: 0;
      topCategory: null;
    };