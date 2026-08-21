import type { CategoryValue } from "./constants";

export type Author = {
  readonly id: number;
  readonly username: string;
  readonly nickname?: string;
};

export type FeedPost = {
  readonly id: number;
  readonly author: Author;
  readonly title: string;
  readonly body: string;
  readonly category: CategoryValue;
  readonly tags: readonly string[];
  readonly publishedAt: Date;
  readonly viewCount: number;
};

export type FeedCard = Pick<
  FeedPost,
  "id" | "title" | "author" | "category" | "publishedAt"
>;

export type FeedStats = Pick<
  FeedPost,
  "viewCount" | "category"
>;
