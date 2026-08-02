// 9-1 関数シグネチャ型

type BinaryOp = (a: number, b: number) => number;

// a, b の型は BinaryOp から推論されるため型注釈は不要
const add: BinaryOp = (a, b) => a + b;
const subtract: BinaryOp = (a, b) => a - b;
const multiply: BinaryOp = (a, b) => a * b;

console.log(add(2, 3));          // 5
console.log(subtract(10, 4));    // 6
console.log(multiply(4, 3));     // 12

// 9-2 オプショナル引数とデフォルト引数

// title?: string は内部では string | undefined
function greet(name: string, title?: string): string {
  if (title !== undefined) {
    return `${title} ${name}`;
  }
  return `Hello, ${name}`;
}

// title: string = "さん" は外からは省略可能だが、関数内では必ず string
function greetDefault(name: string, title: string = "さん"): string {
  return `${title} ${name}`;
}

console.log(greet("Taro", "Mr."));      // Mr. Taro
console.log(greet("Taro"));             // Hello, Taro
console.log(greetDefault("Taro"));      // さん Taro
console.log(greetDefault("Taro", "Dr.")); // Dr. Taro

// 9-3 可変長引数

function sumAll(...nums: number[]): number {
  return nums.reduce((sum, num) => sum + num, 0);
}

console.log(sumAll());              // 0
console.log(sumAll(1, 2, 3));       // 6

const numbers = [10, 20, 30];
console.log(sumAll(...numbers));    // 60

// 9-4 コールバック

type NumPredicate = (n: number) => boolean;

function filterNumbers(
  nums: number[],
  predicate: NumPredicate
): number[] {
  return nums.filter(predicate);
}

console.log(
  filterNumbers([1, 2, 3, 4, 5], n => n % 2 === 0)
); // [2, 4]

console.log(
  filterNumbers([5, 12, 8, 20], n => n >= 10)
); // [12, 20]