export const CATEGORY = {
  tech: "tech",
  daily: "daily",
  review: "review",
  announcement: "announcement",
} as const;

export type CategoryKey = keyof typeof CATEGORY;

export type CategoryValue =
  (typeof CATEGORY)[CategoryKey];