// 商品情報の型（問題2からコピー）
type Item = {
  name: string;
  price: number;
  quantity: number;
};

// T[] を使った関数
function sumPrices(items: Item[]): number {
  return items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
}

// Array<T> を使った関数
// Item[] と Array<Item> は完全に同じ意味
function sumPricesAlt(items: Array<Item>): number {
  return items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
}

// 商品データ
const cart: Item[] = [
  { name: "ノート", price: 1200, quantity: 2 },
  { name: "マウス", price: 480, quantity: 3 },
  { name: "ペン", price: 100, quantity: 4 }
];

// 実行
console.log(sumPrices(cart));      // 4240
console.log(sumPrices([]));        // 0

console.log(sumPricesAlt(cart));   // 4240
console.log(sumPricesAlt([]));     // 0