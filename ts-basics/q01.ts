// 税込価格（円）を整数に切り上げて返す
function calcTax(price: number, rate: number): number {
    return Math.ceil(price * (1 + rate));
}

// 呼び出し例
console.log(calcTax(100, 0.1));
console.log(calcTax(199, 0.1));
console.log(calcTax(0, 0.1));
console.log(calcTax(1280, 0.08));