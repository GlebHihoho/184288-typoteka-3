-- 1. Получить список всех категорий (идентификатор, наименование категории);

SELECT id, name FROM categories;

-- 2. Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);

SELECT id, name FROM categories
  INNER JOIN articles_categories
  ON categories.id = category_id
  GROUP BY id;

-- 3. Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);

SELECT id, name, count(article_id) FROM categories
  INNER JOIN articles_categories
  ON categories.id = category_id
  GROUP BY id;

-- 4. Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации,
-- имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;

SELECT
  articles.id,
  articles.title,
  articles.preview,
  articles.created_at,
  users.first_name,
  users.last_name,
  users.email,
  count(comments.id) as comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  INNER JOIN users ON users.id = articles.user_id
  LEFT JOIN comments ON comments.article_id = articles.id
  INNER JOIN articles_categories ON articles.id = articles_categories.article_id
  INNER JOIN categories ON articles_categories.category_id = categories.id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC;

-- 5. Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс,
-- полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email,
-- количество комментариев, наименование категорий);

SELECT
  articles.id,
  articles.title,
  articles.preview,
  articles.full_text,
  articles.created_at,
  articles.image,
  users.first_name,
  users.last_name,
  users.email,
  count(comments.id) as comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  INNER JOIN users ON users.id = articles.user_id
  LEFT JOIN comments ON comments.article_id = articles.id
  INNER JOIN articles_categories ON articles.id = articles_categories.article_id
  INNER JOIN categories ON articles_categories.category_id = categories.id
WHERE articles.id = 1
  GROUP BY articles.id, users.id;

-- 6. Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария);

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  INNER JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5;

-- 7. Получить список комментариев для определённой публикации (идентификатор комментария,
-- идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  INNER JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.created_at DESC;

-- 8. Обновить заголовок определённой публикации на «Как я встретил Новый год»;

UPDATE articles
  SET title = 'Как я встретил Новый год'
WHERE articles.id = 1;
