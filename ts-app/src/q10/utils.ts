// 配列をキーごとにグループ化する
export function groupBy<T, K extends string | number>(
  items: readonly T[],
  keyOf: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyOf(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// 指定した数値キーで降順に並べ替える
export function sortByDesc<T>(
  items: readonly T[],
  keyOf: (item: T) => number
): T[] {
  return [...items].sort(
    (a, b) => keyOf(b) - keyOf(a)
  );
}