// IDを統一フォーマットに変換する関数
function formatId(id: number | string): string {

  // number型の場合
  if (typeof id === "number") {
    return "ID-" + String(id).padStart(4, "0");
  }

  // string型の場合
  return "ID-" + id.toUpperCase();
}

// 呼び出し例
console.log(formatId(7));         // ID-0007
console.log(formatId(1234));      // ID-1234
console.log(formatId("abc"));     // ID-ABC
console.log(formatId("user01"));  // ID-USER01