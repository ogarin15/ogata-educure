# MiniBooks 課題 提出メモ

> 実際に実行した結果と所要時間を記入してください。未確認の項目を確認済みとは書かないでください。

## フェーズ1：Expressの基本
- 詰まった点：
- 解決方法：
- 学んだこと：

## フェーズ2：Router / Controller / Service
- 詰まった点：
- 解決方法：
- 学んだこと：

## フェーズ3：REST化・DELETE・PUT・PATCH
- 詰まった点：
- 解決方法：
- 学んだこと：

### URL設計レビュー表
| ルール | 自分のAPIはどうか |
|---|---|
| 名詞・複数形を使う | `/api/v1/books` を使用 |
| 動詞をURLに書かない | HTTPメソッドで操作を区別 |
| パスパラメータでリソースを特定 | `/books/:id` を使用 |
| ネストは1階層まで | `/books/:id/reviews` |
| 小文字・ハイフン区切り | URLは小文字を使用 |

### HTTPステータスコード
- `200 OK`：取得・更新成功。本文あり。
- `201 Created`：新規作成成功。
- `204 No Content`：削除成功。本文なし。
- `404 Not Found`：対象リソースが存在しない。

### PUT / POST / PATCH
- `POST`：新規作成。同じリクエストを繰り返すと通常は別リソースが作られるため非冪等。
- `PUT`：指定IDのリソース全体を置き換える。同じ内容を同じIDに送っても結果が同じなので冪等。
- `PATCH`：送信したフィールドだけを部分更新する。

## フェーズ4：Middleware / Error Handler
- 詰まった点：
- 解決方法：
- 学んだこと：

### next() 呼び忘れの観察
- 実験内容：
- 観察結果：

### 3引数エラーハンドラの観察
- 実験内容：
- 観察結果：

## フェーズ5：Zodバリデーション
- 詰まった点：
- 解決方法：
- 学んだこと：

| テスト | 期待値 | 実際の結果 |
|---|---|---|
| 正常なPOST | 201 | |
| `title: ""` | 422 | |
| `publishedYear: "abc"` | 422 | |
| `?limit=101` | 422 | |
| `?limit=abc` | 422 | |
| PATCHでtitleだけ更新 | 200 | |
| PATCHで`publishedYear: "abc"` | 422 | |

## 総所要時間
- 合計：____時間


## 追加課題：DBヘルスチェックとGraceful Shutdown
- `src/db/pool.ts` で PostgreSQL の `Pool` を作成。
- `main()` の最初に `await pool.query("SELECT 1")` を実行し、DB接続失敗時は起動処理を中断。
- DB確認後に `app.listen()` を実行し、返されたサーバーを保持。
- `SIGINT` と `SIGTERM` の両方で同じ `shutdown` 関数を呼び、HTTPサーバー停止後に `pool.end()` を実行。

| 確認項目 | 期待結果 | 実際の結果（実行後に記入） |
|---|---|---|
| 正しい `DATABASE_URL` で起動 | DB確認後に listening が表示される | 未確認 |
| Ctrl+C | closing server and pool → done | 未確認 |
| 誤ったDBパスワード | failed to start が表示され、listening しない | 未確認 |
| 型チェック | `npm run typecheck` 成功 | 未確認 |
