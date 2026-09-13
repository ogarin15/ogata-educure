SELECT id, name, age
FROM users
WHERE age IS NOT NULL
ORDER BY age ASC;

SELECT id, name, age
FROM users
WHERE age IS NOT NULL
ORDER BY age DESC, name ASC;

SELECT title, view_count
FROM posts
WHERE published_at IS NOT NULL
ORDER BY view_count DESC
LIMIT 3;

SELECT id, name, email, age
FROM users
WHERE name LIKE 'S%';

SELECT name, age
FROM users
WHERE age BETWEEN 20 AND 30
ORDER BY age ASC;


SELECT COUNT(*) AS total
FROM users;

SELECT AVG(age) AS avg_age
FROM users;

SELECT MAX(age) AS max_age, MIN(age) AS min_age
FROM users;

SELECT SUM(view_count) AS total_views
FROM posts
WHERE published_at IS NOT NULL;

SELECT COUNT(DISTINCT country) AS country_count
FROM users;

SELECT country, COUNT(*) AS user_count
FROM users
GROUP BY country
ORDER BY user_count DESC;

SELECT country, AVG(age) AS avg_age
FROM users
GROUP BY country
ORDER BY avg_age DESC;

SELECT user_id, COUNT(*) AS post_count
FROM posts
WHERE published_at IS NOT NULL
GROUP BY user_id
ORDER BY post_count DESC;

SELECT user_id, COUNT(*) AS post_count
FROM posts
WHERE published_at IS NOT NULL
GROUP BY user_id
HAVING COUNT(*) >= 2
ORDER BY post_count DESC;

SELECT country,
       COUNT(*) AS user_count,
       AVG(age) AS avg_age
FROM users
GROUP BY country
HAVING COUNT(*) >= 2
ORDER BY user_count DESC;


SELECT posts.title, users.name
FROM posts
JOIN users ON posts.user_id = users.id
WHERE posts.published_at IS NOT NULL;

SELECT comments.body, posts.title, users.name
FROM comments
JOIN posts ON comments.post_id = posts.id
JOIN users ON comments.user_id = users.id
LIMIT 10;

SELECT posts.title
FROM posts
JOIN post_tags ON posts.id = post_tags.post_id
JOIN tags ON post_tags.tag_id = tags.id
WHERE tags.name = 'SQL';

SELECT posts.title
FROM posts
JOIN users ON posts.user_id = users.id
WHERE users.country = 'Japan';

SELECT users.name, posts.title, likes.created_at
FROM likes
JOIN users ON likes.user_id = users.id
JOIN posts ON likes.post_id = posts.id
LIMIT 10;

SELECT users.name, COUNT(posts.id) AS post_count
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name
ORDER BY users.id ASC;

SELECT posts.title, COUNT(comments.id) AS comment_count
FROM posts
LEFT JOIN comments ON posts.id = comments.post_id
GROUP BY posts.id, posts.title
ORDER BY posts.id ASC;

SELECT posts.title
FROM posts
LEFT JOIN likes ON posts.id = likes.post_id
WHERE posts.published_at IS NOT NULL
  AND likes.id IS NULL;

SELECT posts.title
FROM posts
LEFT JOIN post_tags ON posts.id = post_tags.post_id
WHERE posts.published_at IS NOT NULL
  AND post_tags.post_id IS NULL;

SELECT
    posts.title,
    users.name,
    COUNT(DISTINCT likes.id) AS like_count,
    COUNT(DISTINCT comments.id) AS comment_count
FROM posts
JOIN users ON posts.user_id = users.id
LEFT JOIN likes ON posts.id = likes.post_id
LEFT JOIN comments ON posts.id = comments.post_id
WHERE posts.published_at IS NOT NULL
GROUP BY posts.id, posts.title, users.name
ORDER BY like_count DESC;


SELECT title, view_count
FROM posts
WHERE published_at IS NOT NULL
  AND view_count > (
      SELECT AVG(view_count)
      FROM posts
      WHERE published_at IS NOT NULL
  )
ORDER BY view_count DESC;

SELECT DISTINCT users.name
FROM users
JOIN comments ON users.id = comments.user_id
ORDER BY users.id ASC;

SELECT users.name
FROM users
LEFT JOIN comments ON users.id = comments.user_id
WHERE comments.id IS NULL;

SELECT title, view_count
FROM posts
WHERE view_count = (
    SELECT MAX(view_count)
    FROM posts
);

SELECT users.name, COUNT(comments.id) AS comment_count
FROM users
LEFT JOIN comments ON users.id = comments.user_id
GROUP BY users.id, users.name
HAVING COUNT(comments.id) > (
    SELECT AVG(comment_count)
    FROM (
        SELECT COUNT(comments.id) AS comment_count
        FROM users
        LEFT JOIN comments ON users.id = comments.user_id
        GROUP BY users.id
    ) AS user_comments
)
ORDER BY comment_count DESC;


INSERT INTO users (name, email, age, country)
VALUES ('Test User', 'test@example.com', 25, 'Japan')
RETURNING id;

INSERT INTO tags (name)
VALUES
    ('DB'),
    ('Web'),
    ('Infra');

UPDATE users
SET country = 'Ireland'
WHERE email = 'dave@example.com'
RETURNING id, name, country;


BEGIN;

DELETE FROM posts
WHERE published_at IS NULL
RETURNING id, title;


BEGIN;

DELETE FROM comments
WHERE created_at < '2026-02-01'
RETURNING id, post_id, user_id;


WITH user_post_counts AS (
    SELECT user_id, COUNT(*) AS post_count
    FROM posts
    WHERE published_at IS NOT NULL
    GROUP BY user_id
)
SELECT users.name, user_post_counts.post_count
FROM user_post_counts
JOIN users ON user_post_counts.user_id = users.id
ORDER BY user_post_counts.post_count DESC
LIMIT 3;


SELECT
    DATE_TRUNC('month', published_at) AS month,
    COUNT(*) AS post_count
FROM posts
WHERE published_at IS NOT NULL
GROUP BY DATE_TRUNC('month', published_at)
ORDER BY month ASC;


SELECT
    posts.title,
    COALESCE(STRING_AGG(tags.name, ', ' ORDER BY tags.name), '') AS tags
FROM posts
LEFT JOIN post_tags ON posts.id = post_tags.post_id
LEFT JOIN tags ON post_tags.tag_id = tags.id
WHERE posts.published_at IS NOT NULL
GROUP BY posts.id, posts.title
ORDER BY posts.id ASC;


SELECT
    tags.name,
    COUNT(DISTINCT posts.id) AS post_count
FROM tags
JOIN post_tags ON tags.id = post_tags.tag_id
JOIN posts ON post_tags.post_id = posts.id
WHERE posts.published_at IS NOT NULL
GROUP BY tags.id, tags.name
ORDER BY post_count DESC;


SELECT
    posts.title,
    COUNT(post_tags.tag_id) AS tag_count
FROM posts
JOIN post_tags ON posts.id = post_tags.post_id
WHERE posts.published_at IS NOT NULL
GROUP BY posts.id, posts.title
HAVING COUNT(post_tags.tag_id) >= 2
ORDER BY tag_count DESC;