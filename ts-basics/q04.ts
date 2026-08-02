// ラベルなしタプル
function midpoint(
  a: [number, number],
  b: [number, number]
): [number, number] {
  return [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2
  ];
}

// ラベル付きタプル
// ラベルは値の型を変えるわけではなく、エディタで引数名が見やすくなるだけ
function midpointLabel(
  a: [x: number, y: number],
  b: [x: number, y: number]
): [x: number, y: number] {
  return [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2
  ];
}

// 呼び出し例
console.log(midpoint([0, 0], [10, 10]));     // [5, 5]
console.log(midpoint([-2, 4], [2, -4]));     // [0, 0]

console.log(midpointLabel([1, 2], [4, 8]));  // [2.5, 5]
console.log(midpointLabel([-6, 3], [4, -7])); // [-1, -2]