-- ========== スキーマ ==========
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  age        INTEGER,
  country    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  view_count   INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,                              -- NULL = 下書き
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE likes (
  user_id    INTEGER NOT NULL REFERENCES users(id),
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- ========== サンプルデータ ==========
INSERT INTO users (name, email, age, country) VALUES
  ('田中太郎',    'tanaka@example.com',     28, 'Japan'),
  ('鈴木花子',    'suzuki@example.com',     34, 'Japan'),
  ('佐藤次郎',    'sato@example.com',       22, 'Japan'),
  ('Alice Smith',  'alice@example.com',     30, 'USA'),
  ('Bob Jones',    'bob@example.com',       45, 'USA'),
  ('Carol Brown',  'carol@example.com',     27, 'UK'),
  ('Dave Miller',  'dave@example.com',    NULL, 'UK'),
  ('山田三郎',    'yamada@example.com',     19, 'Japan'),
  ('Eva Davis',    'eva@example.com',       38, 'Germany'),
  ('Frank White',  'frank@example.com',     55, 'USA'),
  ('Ana García',   'ana@example.com',       26, 'Spain'),
  ('小林四郎',    'kobayashi@example.com',  31, 'Japan');

INSERT INTO posts (user_id, title, body, view_count, published_at) VALUES
  ( 1, 'SQL 入門',          '本文 1',   150, '2026-01-10 10:00+09'),
  ( 1, 'PostgreSQL の特徴', '本文 2',   320, '2026-02-05 10:00+09'),
  ( 2, '日本旅行記',        '本文 3',   850, '2026-02-14 10:00+09'),
  ( 2, '下書き',            '本文 4',     0, NULL),
  ( 3, 'プログラミング入門','本文 5',    45, '2026-03-01 10:00+09'),
  ( 4, 'NY Diary',          '本文 6',  1200, '2026-01-15 10:00+09'),
  ( 4, 'Tech Trends 2026',  '本文 7',   430, '2026-03-10 10:00+09'),
  ( 5, 'Retirement Tips',   '本文 8',   780, '2026-02-20 10:00+09'),
  ( 6, 'London Cafes',      '本文 9',   210, '2026-03-05 10:00+09'),
  ( 6, 'Untitled',          '本文 10',    0, NULL),
  ( 7, 'UK Food',           '本文 11',  190, '2026-01-25 10:00+09'),
  ( 8, '大学生活',          '本文 12',   60, '2026-03-20 10:00+09'),
  ( 9, 'Berlin Guide',      '本文 13',  520, '2026-02-28 10:00+09'),
  (10, 'Drafting',          '本文 14',    0, NULL),
  (11, 'Spanish Recipes',   '本文 15',  340, '2026-03-15 10:00+09'),
  ( 1, '続・SQL 入門',      '本文 16',  200, '2026-04-01 10:00+09'),
  ( 2, '京都散策',          '本文 17',  660, '2026-04-10 10:00+09'),
  ( 4, 'Draft 2',           '本文 18',    0, NULL),
  ( 5, 'Travel Tips',       '本文 19',  890, '2026-03-25 10:00+09'),
  (12, 'SQL 実務 Tips',     '本文 20',  420, '2026-04-15 10:00+09');

INSERT INTO comments (post_id, user_id, body) VALUES
  ( 1, 2, 'いい記事です'),       ( 1, 3, '勉強になりました'),
  ( 2, 4, 'Great!'),              ( 3, 1, '京都も行きたい'),
  ( 3, 6, 'Amazing photos'),      ( 5, 2, '初心者に優しい'),
  ( 6, 5, 'Love NY'),             ( 7, 8, '興味深い'),
  ( 7, 9, 'Useful'),              ( 9, 5, 'I miss London'),
  (11, 4, 'British food good'),   (13,10, 'Want to visit'),
  (15, 3, '美味しそう'),          (16, 2, '続編ありがとう'),
  (17, 4, '美しい'),              (19, 6, 'Good tips'),
  (20, 1, '実務で役立つ'),        (20, 2, 'ブックマーク'),
  ( 1, 4, 'English version?'),    ( 2, 1, '自分の投稿にコメント'),
  ( 3, 9, 'Nice!'),               ( 6, 2, '英語力 up'),
  ( 3,11, 'Hermoso'),             ( 5, 8, 'Good entry'),
  ( 8,11, 'Useful'),              (11,12, 'UK food ok'),
  (13, 3, 'ベルリン!'),           (15, 5, 'Spanish yum'),
  (17,10, 'Beautiful'),           (19,12, 'Tips useful');

INSERT INTO tags (name) VALUES
  ('SQL'), ('PostgreSQL'), ('旅行'), ('プログラミング'), ('Tech'), ('Food');

INSERT INTO post_tags (post_id, tag_id) VALUES
  ( 1, 1), ( 1, 4),
  ( 2, 1), ( 2, 2), ( 2, 4),
  ( 3, 3),
  ( 5, 4),
  ( 6, 3),
  ( 7, 5),
  ( 8, 5),
  ( 9, 3), ( 9, 6),
  (11, 6),
  (13, 3),
  (15, 6),
  (16, 1), (16, 4),
  (17, 3),
  (19, 3),
  (20, 1), (20, 2), (20, 5);

INSERT INTO likes (user_id, post_id) VALUES
  ( 1, 3), ( 1, 6), ( 1,17), ( 1,19),
  ( 2, 1), ( 2, 6), ( 2, 7), ( 2,16),
  ( 3, 1), ( 3, 5), ( 3,17),
  ( 4, 3), ( 4, 7), ( 4, 8), ( 4,11),
  ( 5, 6), ( 5, 9), ( 5,19),
  ( 6, 3), ( 6, 9), ( 6,13), ( 6,19),
  ( 7, 8),
  ( 8, 5),
  ( 9, 7), ( 9,13),
  (10, 3), (10,17),
  (11, 3), (11,15),
  (12,20), (12,16), (12, 1);