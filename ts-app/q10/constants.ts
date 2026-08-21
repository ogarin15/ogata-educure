export const CATEGORY = {
  Tech: "tech",
  Daily: "daily",
  Review: "review",
  Announcement: "announcement",
} as const;

export type CategoryKey = keyof typeof CATEGORY;

export type CategoryValue =
  (typeof CATEGORY)[CategoryKey];
