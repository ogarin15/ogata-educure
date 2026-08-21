import type { FeedPost } from "./types";

export function isPublished(post: FeedPost): post is FeedPost {
  return post.publishedAt.getTime() <= Date.now();
}

export function isPopular(post: FeedPost): boolean {
  return post.viewCount >= 100;
}

export type FeedAggregate =
  | {
      readonly ok: true;
      readonly total: number;
      readonly count: number;
      readonly topCategory: string;
    }
  | {
      readonly ok: false;
      readonly reason: string;
    };
