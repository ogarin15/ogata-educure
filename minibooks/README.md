# MiniBooks API — Node.js基礎2課題

Express + TypeScript + ESM + Zodで作る書評SNS「MiniBooks」のAPIです。最終形（フェーズ5）までのファイルを1つのプロジェクトにまとめています。

## 起動方法
1. VS Codeで `minibooks` フォルダーを開く。
2. Node.js 20.6以上（推奨22 LTS）を用意する。
3. VS Codeの「ターミナル」→「新しいターミナル」を開く。
4. 次を順番に実行する。

```bash
npm install
npm run dev
```

`[development] MiniBooks API listening on http://localhost:3000` と表示されれば起動成功。停止は `Ctrl + C`。

## フォルダー構成
```text
minibooks/
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── .gitignore
└── src/
    ├── index.ts
    ├── config.ts
    ├── routes/books.ts
    ├── controllers/bookController.ts
    ├── services/bookService.ts
    ├── schemas/bookSchema.ts
    └── middlewares/
        ├── logger.ts
        ├── errorHandler.ts
        ├── wrap.ts
        └── validate.ts
```

## 動作確認（PowerShellはcurl.exeを使用）
別ターミナルで実行する。サーバーは起動したままにする。

```bash
curl.exe -i http://localhost:3000/
curl.exe -i http://localhost:3000/api/v1/books/1
curl.exe -i http://localhost:3000/api/v1/books/999
curl.exe -i "http://localhost:3000/api/v1/books?author=Orwell"
curl.exe -i "http://localhost:3000/api/v1/books?limit=2"
curl.exe -i http://localhost:3000/api/v1/books/1/reviews
```

### POST（201 Created）
```bash
curl.exe -i -X POST -H "Content-Type: application/json" -d "{\"title\":\"Animal Farm\",\"author\":\"Orwell\",\"publishedYear\":1945}" http://localhost:3000/api/v1/books
```

### PUT（全更新）・PATCH（部分更新）
```bash
curl.exe -i -X PUT -H "Content-Type: application/json" -d "{\"title\":\"Nineteen Eighty-Four\",\"author\":\"George Orwell\",\"publishedYear\":1949}" http://localhost:3000/api/v1/books/1
curl.exe -i -X PATCH -H "Content-Type: application/json" -d "{\"title\":\"Updated title\"}" http://localhost:3000/api/v1/books/1
```

### DELETE（204 No Content）
```bash
curl.exe -i -X DELETE http://localhost:3000/api/v1/books/2
```

### 422バリデーション・共通エラー
```bash
curl.exe -i -X POST -H "Content-Type: application/json" -d "{\"title\":\"\",\"author\":\"X\",\"publishedYear\":1949}" http://localhost:3000/api/v1/books
curl.exe -i "http://localhost:3000/api/v1/books?limit=101"
curl.exe -i "http://localhost:3000/api/v1/books?limit=abc"
curl.exe -i -X PATCH -H "Content-Type: application/json" -d "{\"publishedYear\":\"abc\"}" http://localhost:3000/api/v1/books/1
curl.exe -i http://localhost:3000/api/v1/books/_throw
curl.exe -i http://localhost:3000/this-route-does-not-exist
```

`/_throw` は500エラーを意図的に起こす確認用ルート。

## HTTPメソッド・ステータスコード
| メソッド | 用途 | 冪等性 |
|---|---|---|
| GET | 取得 | あり |
| POST | 新規作成 | なし |
| PUT | 全項目置換 | あり |
| PATCH | 部分更新 | この実装では同じ値の再送で結果は同じ |
| DELETE | 削除 | あり（2回目は404） |

200=取得/更新成功、201=作成成功、204=削除成功（本文なし）、404=対象なし、422=入力値不正、500=想定外エラー。

## 役割分担
- routes：URLとControllerを結ぶ。
- controllers：Requestを受け、Serviceの結果をHTTPレスポンスにする。
- services：データ操作。ExpressのRequest/Responseを知らない。
- schemas：Zodでbody / params / queryを検証する。
- middlewares：logger、CORS、validate、errorHandlerなどの共通処理。

## Git提出について
このZIPにはフェーズ5までの完成コードを収録していますが、Setup+Q01〜Q10の途中状態のGitコミット履歴は含めていません。授業で各問題のコミットが必要な場合は、各段階の作業完了時に次のように記録してください。

```bash
git init
git add .
git commit -m "Setup: initialize MiniBooks project"
# 各Qの作業完了後
git add .
git commit -m "Q01: add book detail endpoint"
```

## 注意
- データはメモリ上の配列に保存するため、サーバー再起動で追加・更新・削除がリセットされる。
- CORSは課題用に全Origin許可。実運用では許可Originを限定する。
- `.env` はGitに登録しない。
