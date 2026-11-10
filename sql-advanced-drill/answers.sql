-- SQL Advanced Drill：問1～問10
-- 各問の実行前にコメントを読み、必要な順番で実行すること。
-- 問1のデータ追加は 01-bulk-data.sql で実行する。

-- ============================================================
-- 問1：データ件数の確認
-- 01-bulk-data.sql 実行後、10,000件になっていることを確認
-- ============================================================
SELECT COUNT(*) AS post_count FROM posts;

-- ============================================================
-- 問2：単列インデックス Before / After
-- ① Before：まずインデックス作成前に実行し、結果を q02-before-index.txt に保存
-- ============================================================
EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE user_id = 1;

-- ② インデックス作成
CREATE INDEX idx_posts_user_id ON posts (user_id);

-- ③ After：結果を q02-after-index.txt に保存
EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE user_id = 1;

-- ============================================================
-- 問3：複合インデックスと列順
-- ① 複合インデックス作成
-- ============================================================
CREATE INDEX idx_posts_user_pub
ON posts (user_id, published_at DESC);

-- ② クエリA：先頭列 user_id を条件に含むため複合インデックスが利用候補になる
-- 結果を q03-composite-A.txt に保存
EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE user_id = 1
  AND published_at IS NOT NULL
ORDER BY published_at DESC
LIMIT 20;

-- ③ クエリB：先頭列 user_id を条件に含まないため、この複合インデックスは通常利用されない
-- 結果を q03-composite-B.txt に保存
EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE published_at >= NOW() - INTERVAL '36 days'
ORDER BY published_at DESC
LIMIT 20;

-- ============================================================
-- 問4：BEGIN / COMMIT と BEGIN / ROLLBACK
-- ① COMMIT：users.id=1 の country を Tokyo に更新して確定
-- ============================================================
BEGIN;
UPDATE users SET country = 'Tokyo' WHERE id = 1;
COMMIT;

-- ② ROLLBACK：一時的に TEST に変更し、確認してから取り消す
BEGIN;
UPDATE users SET country = 'TEST' WHERE id = 2;
SELECT country FROM users WHERE id = 2;
ROLLBACK;
SELECT country FROM users WHERE id = 2;

-- ============================================================
-- 問5：SAVEPOINT で部分ロールバック
-- likes の主キーは (user_id, post_id)。既存の (1,3) を重複挿入してエラーを発生させる。
-- エラー後は ROLLBACK TO SAVEPOINT で復旧し、トランザクションを続ける。
-- ============================================================
BEGIN;
UPDATE users SET age = age + 1 WHERE id = 1;
SAVEPOINT before_duplicate_like;
INSERT INTO likes (user_id, post_id) VALUES (1, 3);
-- ↑ここは主キー重複エラーになる想定
ROLLBACK TO SAVEPOINT before_duplicate_like;
UPDATE users SET country = 'Japan' WHERE id = 1;
COMMIT;

-- ============================================================
-- 問6：分離レベル確認 / SERIALIZABLE
-- ============================================================
SHOW transaction_isolation;

BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT COUNT(*) FROM posts;
COMMIT;

-- ============================================================
-- 問7：既存列に NOT NULL / CHECK 制約を追加
-- ============================================================
-- body は元スキーマですでに NOT NULL。念のため NULL がないことを確認してから実行。
SELECT COUNT(*) AS null_body_count FROM posts WHERE body IS NULL;
ALTER TABLE posts ALTER COLUMN body SET NOT NULL;

ALTER TABLE posts
ADD CONSTRAINT posts_view_count_nonneg CHECK (view_count >= 0);

-- 既存メールがすべて xxx@yyy.zzz 形式であることを確認してから追加
SELECT id, email
FROM users
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

ALTER TABLE users
ADD CONSTRAINT users_email_format
CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ============================================================
-- 問8：制約違反と既存違反データへの対処
-- (a) view_count の CHECK 違反を試す。エラー後、トランザクションを ROLLBACK。
-- ============================================================
BEGIN;
INSERT INTO posts (user_id, title, body, view_count, published_at)
VALUES (1, 'check violation test', 'test body', -1, NOW());
-- ↑ CHECK 制約違反になる想定
ROLLBACK;

-- (b) 空タイトルの既存違反データを作り、制約追加が失敗することを確認
INSERT INTO posts (user_id, title, body, view_count, published_at)
VALUES (1, '', 'temporary invalid title', 0, NOW());

-- 次の ALTER TABLE は失敗する想定。エラーを確認したら実行を止める。
ALTER TABLE posts
ADD CONSTRAINT posts_title_length CHECK (length(title) > 0);

-- 違反行を特定
SELECT id, title
FROM posts
WHERE length(title) = 0;

-- ↑ SELECTで確認したIDを使って修正（この例では空タイトルを修正）
UPDATE posts
SET title = '修正済みタイトル'
WHERE length(title) = 0;

-- 修正後に制約を追加
ALTER TABLE posts
ADD CONSTRAINT posts_title_length CHECK (length(title) > 0);

-- ============================================================
-- 問9：updated_at / deleted_at、更新トリガー、論理削除、ビュー
-- ============================================================
ALTER TABLE posts
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION set_posts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_posts_set_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_posts_updated_at();

-- 更新前の値を確認
SELECT id, updated_at FROM posts WHERE id = 1;

-- 値を変更せず UPDATE してもトリガーが動く
UPDATE posts SET title = title WHERE id = 1;

-- 更新後の値を確認（実行時刻が同じだと差が見えにくい場合は少し待って再実行）
SELECT id, updated_at FROM posts WHERE id = 1;

-- 論理削除：id=1 の投稿を削除扱いにする
UPDATE posts SET deleted_at = NOW() WHERE id = 1;

CREATE OR REPLACE VIEW posts_active AS
SELECT *
FROM posts
WHERE deleted_at IS NULL;

-- 全件数と生存行数を比較
SELECT COUNT(*) AS all_posts_count FROM posts;
SELECT COUNT(*) AS active_posts_count FROM posts_active;

-- ============================================================
-- 問10：部分インデックス / OFFSET とカーソル方式
-- ============================================================
CREATE INDEX idx_posts_active_published
ON posts (published_at DESC NULLS LAST, id DESC)
WHERE deleted_at IS NULL;

-- OFFSET方式：結果を q10-offset.txt に保存
EXPLAIN ANALYZE
SELECT id, title
FROM posts
WHERE deleted_at IS NULL
ORDER BY published_at DESC NULLS LAST, id DESC
LIMIT 20 OFFSET 1980;

-- カーソル方式：まず1ページ目の最後の行の published_at と id を確認する。
-- 下の日時・IDは例ではなく、必ず自分の1ページ目の20件目の実値に置き換える。
-- SELECT id, title, published_at FROM posts
-- WHERE deleted_at IS NULL AND published_at IS NOT NULL
-- ORDER BY published_at DESC NULLS LAST, id DESC
-- LIMIT 20;
-- 結果を q10-cursor.txt に保存
-- EXPLAIN ANALYZE
-- SELECT id, title
-- FROM posts
-- WHERE deleted_at IS NULL
--   AND published_at IS NOT NULL
--   AND (published_at, id) < (TIMESTAMPTZ '2026-01-15 18:00:00+09', 12345)
-- ORDER BY published_at DESC NULLS LAST, id DESC
-- LIMIT 20;
-- ↑ TIMESTAMPTZ と id は、自分の1ページ目の20件目の値に必ず置き換えてから実行。
