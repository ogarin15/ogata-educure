// ユーザー情報
type User = {
  id: number;
  name: string;
  nickname: string | null; // 未設定なら null
  age?: number;            // 非公開なら undefined
};

// 表示名を生成する
function displayName(user: User): string {

  // ニックネームがあればニックネーム、なければ名前
  let display: string;

  if (user.nickname !== null) {
    display = user.nickname;
  } else {
    display = user.name;
  }

  // 年齢があれば追加
  if (user.age !== undefined) {
    display += ` (${user.age})`;
  }

  return display;
}

// 呼び出し例
console.log(
  displayName({
    id: 1,
    name: "Tanaka",
    nickname: "Taro",
    age: 30
  })
); // Taro (30)

console.log(
  displayName({
    id: 2,
    name: "Sato",
    nickname: null,
    age: 25
  })
); // Sato (25)

console.log(
  displayName({
    id: 3,
    name: "Suzuki",
    nickname: "Suzu"
  })
); // Suzu

console.log(
  displayName({
    id: 4,
    name: "Yamada",
    nickname: null
  })
); // Yamada