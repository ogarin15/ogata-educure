-- 問1：posts を 10,000 件にする（既存20件 + 9,980件）
-- 注意：このファイルは同じDBで2回実行しないこと。
-- 既存データを消さず、追加分だけを投入する。

INSERT INTO posts (user_id, title, body, view_count, published_at)
SELECT
    floor(random() * 12 + 1)::integer,
    '追加投稿 ' || gs,
    '追加データ本文 ' || gs,
    floor(random() * 2001)::integer,
    CASE
        WHEN random() < 0.9
            THEN NOW() - random() * INTERVAL '1 year'
        ELSE NULL
    END
FROM generate_series(1, 9980) AS gs;

-- 件数確認：元の20件を含めて10,000件になる想定
SELECT COUNT(*) AS post_count FROM posts;
