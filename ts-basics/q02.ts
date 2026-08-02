// 商品情報の型
type Item = {
  name: string;
  price: number;
  quantity: number;
};

// 名前付き型を使った関数
function itemTotal(item: Item): number {
  return item.price * item.quantity;
}

// インライン型を使った関数
// ↓ このインライン型は Item 型と構造的に同じ
function itemTotalInline(
  item: { name: string; price: number; quantity: number }
): number {
  return item.price * item.quantity;
}

// 呼び出し例
console.log(itemTotal({ name: "ノート", price: 1200, quantity: 2 }));      // 2400
console.log(itemTotal({ name: "えんぴつ", price: 100, quantity: 0 }));      // 0

console.log(itemTotalInline({ name: "マウス", price: 480, quantity: 3 }));  // 1440
console.log(itemTotalInline({ name: "ペン", price: 250, quantity: 4 }));    // 1000