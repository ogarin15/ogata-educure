-- 問1
EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE user_id = 1;

CREATE INDEX idx_posts_user_id
ON posts(user_id);

EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE user_id = 1;


-- 問2
BEGIN;

UPDATE users
SET country = 'Tokyo'
WHERE id = 1;

COMMIT;

BEGIN;

UPDATE users
SET country = 'TEST'
WHERE id = 2;

SELECT country
FROM users
WHERE id = 2;

ROLLBACK;

SELECT country
FROM users
WHERE id = 2;


-- 問3
-- 複合インデックスは先頭列であるuser_idをWHERE条件に含めることで効率よく利用できる。
-- クエリBはuser_idをWHERE条件に含めていないため、
-- (user_id, published_at) の複合インデックスを有効に利用できる。

CREATE INDEX idx_posts_user_pub
ON posts (user_id, published_at DESC);

EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE user_id = 1
  AND published_at IS NOT NULL
ORDER BY published_at DESC
LIMIT 20;

EXPLAIN ANALYZE
SELECT *
FROM posts
WHERE published_at >= NOW() - INTERVAL '30 days'
ORDER BY published_at DESC
LIMIT 20;


-- 問4
BEGIN;

UPDATE users
SET country = 'Japan'
WHERE id = 1;

SAVEPOINT sp1;

-- わざと重複エラーを発生させる
INSERT INTO users (name, email, age, country)
VALUES ('Test User', 'test@example.com', 25, 'Japan');

ROLLBACK TO SAVEPOINT sp1;

UPDATE users
SET country = 'Japan'
WHERE id = 2;

COMMIT;


-- 問5
-- 問5は教材指定の内容が必要なため、現時点では空欄


-- 問6
-- PostgreSQLのデフォルトの分離レベルは READ COMMITTED。
-- SERIALIZABLEでは、通常のBEGIN（READ COMMITTED）よりも
-- トランザクション間の同時実行による不整合を防ぐため、
-- より厳密に直列実行と同等になるよう制御される。

SHOW transaction_isolation;

BEGIN ISOLATION LEVEL SERIALIZABLE;

SELECT COUNT(*)
FROM posts;

COMMIT;


-- 問7
-- ① posts.body にNOT NULL制約を追加
ALTER TABLE posts
ALTER COLUMN body SET NOT NULL;

-- ② posts.view_count が0以上であることを保証
ALTER TABLE posts
ADD CONSTRAINT posts_view_count_nonneg
CHECK (view_count >= 0);

-- ③ users.email に@が含まれることを保証
ALTER TABLE users
ADD CONSTRAINT users_email_format
CHECK (email LIKE '%@%');


-- 問8
-- （a）制約違反INSERTを体感
BEGIN;

INSERT INTO posts (user_id, title, body, view_count)
VALUES (1, 't', 'b', -1);

ROLLBACK;


-- （b）既存違反データへの対処

INSERT INTO posts
    (user_id, title, body, view_count, published_at)
VALUES
    (1, '', 'body', 0, NOW());

-- 既存の違反データがあるため失敗
ALTER TABLE posts
ADD CONSTRAINT posts_title_length
CHECK (length(title) > 0);

-- 違反行を特定
SELECT id, title
FROM posts
WHERE length(title) = 0;

-- 違反データを削除
DELETE FROM posts
WHERE length(title) = 0;

-- データ修正後、制約追加
ALTER TABLE posts
ADD CONSTRAINT posts_title_length
CHECK (length(title) > 0);


-- 問9
-- ① postsにupdated_atとdeleted_atを追加
ALTER TABLE posts
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN deleted_at TIMESTAMPTZ;


-- ② UPDATE時にupdated_atを自動更新する関数を作成
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ③ postsテーブルにトリガーを設定
CREATE TRIGGER posts_set_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ④ UPDATE前のupdated_atを確認
SELECT id, updated_at
FROM posts
WHERE id = 1;

-- id=1をUPDATE
UPDATE posts
SET title = title
WHERE id = 1;

-- UPDATE後のupdated_atを確認
SELECT id, updated_at
FROM posts
WHERE id = 1;


-- ⑤ id=2を論理削除
UPDATE posts
SET deleted_at = NOW()
WHERE id = 2;


-- 生存している投稿だけを返すビューを作成
CREATE VIEW posts_active AS
SELECT *
FROM posts
WHERE deleted_at IS NULL;


-- 全投稿数を確認
SELECT COUNT(*) AS total_posts
FROM posts;

-- 生存している投稿数を確認
SELECT COUNT(*) AS active_posts
FROM posts_active;


-- 問10
-- ① 生存行専用の部分インデックスを作成
CREATE INDEX idx_posts_active_published
ON posts (published_at DESC)
WHERE deleted_at IS NULL;


-- ② OFFSET方式：100ページ目（1ページ20件）
EXPLAIN ANALYZE
SELECT id, title
FROM posts
WHERE deleted_at IS NULL
ORDER BY published_at DESC NULLS LAST
LIMIT 20 OFFSET 1980;


-- ③ カーソル方式で使用する1ページ目の最後の値を確認
SELECT id, published_at
FROM posts
WHERE deleted_at IS NULL
ORDER BY published_at DESC NULLS LAST, id DESC
LIMIT 20;


-- ④ カーソル方式
-- ③の結果から取得した値に置き換える

EXPLAIN ANALYZE
SELECT id, title
FROM posts
WHERE deleted_at IS NULL
  AND (published_at, id) <
      ('2026-01-15 10:00:00+09', 12345)
ORDER BY published_at DESC NULLS LAST, id DESC
LIMIT 20;