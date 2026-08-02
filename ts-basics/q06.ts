// 信号機の色
type Signal = "red" | "yellow" | "green";

// 次の信号を返す
function nextSignal(current: Signal): Signal {
  switch (current) {
    case "red":
      return "green";

    case "green":
      return "yellow";

    case "yellow":
      return "red";
  }

  /*
  確認用（提出時はコメントのままでOK）

  例えば "yellow" の case を削除すると、
  「Function lacks ending return statement」
  のようなエラーが出る。
  これは戻り値に undefined の可能性があるためで、
  switch が全ケースを網羅していないことを教えてくれる。
  */
}

// 呼び出し例
console.log(nextSignal("red"));     // green
console.log(nextSignal("green"));   // yellow
console.log(nextSignal("yellow"));  // red