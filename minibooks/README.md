# MiniBooks API — フェーズ1〜5

Express + TypeScript の書籍API演習です。Router / Controller / Service / Middleware / Zod validation を分離しています。

## 起動方法
1. Node.js 20.6以上（LTS推奨）とPostgreSQLをインストールします。
2. VS Codeでこの `minibooks` フォルダを開きます。
3. `.env` の `DATABASE_URL` を、自分のPostgreSQLのユーザー名・パスワード・DB名に合わせて変更します。例：`postgres://postgres:実際のパスワード@localhost:5432/minibooks`。`minibooks` データベースも事前に作成してください。
4. 「ターミナル」→「新しいターミナル」で次を実行します。

```bash
npm install
npm run dev
```

DBに接続できた場合の起動表示：`[development] MiniBooks API listening on http://localhost:3000`

起動時に `SELECT 1` でDB接続を確認します。接続に失敗した場合は `failed to start:` を表示して終了し、HTTPサーバーは起動しません。Ctrl+C（SIGINT）またはSIGTERMを受けるとHTTPサーバーとDB接続プールを終了します。

型チェック：`npm run typecheck`

## DBヘルスチェック・終了処理の確認
1. `.env` の `DATABASE_URL` を実際のPostgreSQL接続情報に合わせます。
2. `npm run dev` を実行し、DB接続に成功したときだけ `listening` が表示されることを確認します。
3. `Ctrl+C` を押し、`[shutdown] closing server and pool` と `[shutdown] done` が表示されることを確認します。
4. `.env` のパスワードを一時的に誤った値に変更し、`npm run dev` を実行します。`failed to start:` が表示され、`listening` が表示されずに終了することを確認します。
5. 必ず `.env` のパスワードを正しい値に戻します。

## URL一覧
- `GET /api/v1/books`
- `GET /api/v1/books?author=Orwell&limit=2`
- `GET /api/v1/books/:id`
- `POST /api/v1/books`
- `PUT /api/v1/books/:id`
- `PATCH /api/v1/books/:id`
- `DELETE /api/v1/books/:id`
- `GET /api/v1/books/:id/reviews`（課題の雛形：空配列）
- `GET /api/v1/books/_throw`（500エラー確認用）
- `GET /`（Welcome）

古い `GET /books` は404になります。

## 動作確認例（PowerShellでは curl.exe を使用）
```powershell
curl.exe -i http://localhost:3000/api/v1/books
curl.exe -i http://localhost:3000/api/v1/books/1
curl.exe -i http://localhost:3000/api/v1/books/missing
curl.exe -i http://localhost:3000/api/v1/books/1/reviews
curl.exe -i -X POST -H "Content-Type: application/json" -d "{\"title\":\"Brave New World\",\"author\":\"Huxley\",\"publishedYear\":1932}" http://localhost:3000/api/v1/books
curl.exe -i -X PUT -H "Content-Type: application/json" -d "{\"title\":\"Nineteen Eighty-Four\",\"author\":\"George Orwell\",\"publishedYear\":1949}" http://localhost:3000/api/v1/books/2
curl.exe -i -X PATCH -H "Content-Type: application/json" -d "{\"title\":\"Le Petit Prince (改訳版)\"}" http://localhost:3000/api/v1/books/1
curl.exe -i -X DELETE http://localhost:3000/api/v1/books/2
curl.exe -i http://localhost:3000/api/v1/books/_throw
curl.exe -i -X OPTIONS -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: GET" http://localhost:3000/api/v1/books
curl.exe -i -X POST -H "Content-Type: application/json" -d "{\"title\":\"\",\"author\":\"X\",\"publishedYear\":1949}" http://localhost:3000/api/v1/books
curl.exe -i -X POST -H "Content-Type: application/json" -d "{\"title\":\"X\",\"author\":\"Y\",\"publishedYear\":\"abc\"}" http://localhost:3000/api/v1/books
curl.exe -i "http://localhost:3000/api/v1/books?limit=101"
curl.exe -i "http://localhost:3000/api/v1/books?limit=abc"
curl.exe -i -X PATCH -H "Content-Type: application/json" -d "{\"publishedYear\":\"abc\"}" http://localhost:3000/api/v1/books/1
```

## 注意
- 書籍APIのデータは引き続きメモリ上のMapに保存されるため、サーバー再起動で初期データに戻ります。PostgreSQLはこの課題では起動時のヘルスチェックと終了処理に使用します。
- `SUBMISSION.md` に各フェーズの振り返りと実際のテスト結果を記入してください。
- `node_modules` と `.env` はGitにコミットしないでください。
- 提出前に `npm install`、`npm run typecheck`、curlの動作確認を行ってください。
