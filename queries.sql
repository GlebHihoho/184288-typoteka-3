-- 1. Получить список всех категорий (идентификатор, наименование категории);

SELECT id, name FROM categories;

-- 2. Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);

SELECT id, name FROM categories
  JOIN articles_categories
  ON id = categoryId
  GROUP BY id;

-- 3. Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);

SELECT id, name, count(articleId) FROM categories
  JOIN articles_categories
  ON id = categoryId
  GROUP BY id;

-- 4. Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации,
-- имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;

SELECT
  articles.id,
  articles.title,
  articles.preview,
  articles.createdAt,
  users.firstName,
  users.lastName,
  users.email,
  count(comments.id) as commentsCount,
  STRING_AGG(DISTINCT categories.name, ', ') AS categoryList
FROM articles
  JOIN users ON users.id = articles.userId
  LEFT JOIN comments ON comments.articleId = articles.id
  JOIN articles_categories ON articles.id = articles_categories.articleId
  JOIN categories ON articles_categories.categoryId = categories.id
  GROUP BY articles.id, users.id
  ORDER BY articles.createdAt DESC;

-- 5. Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс,
-- полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email,
-- количество комментариев, наименование категорий);

SELECT
    articles.id,
    articles.title,
    articles.preview,
    articles.fullText,
    articles.createdAt,
    articles.image,
    users.firstName,
    users.lastName,
    users.email,
    count(comments.id) as commentsCount,
    STRING_AGG(DISTINCT categories.name, ', ') AS categoryList
FROM articles
    JOIN users ON users.id = articles.userId
    LEFT JOIN comments ON comments.articleId = articles.id
    JOIN articles_categories ON articles.id = articles_categories.articleId
    JOIN categories ON articles_categories.categoryId = categories.id
WHERE articles.id = 1
    GROUP BY articles.id, users.id;

-- 6. Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария);

SELECT
  comments.id,
  comments.articleId,
  users.firstName,
  users.lastName,
  comments.text
FROM comments
  JOIN users ON comments.userId = users.id
  ORDER BY comments.createdAt DESC
  LIMIT 5;

-- 7. Получить список комментариев для определённой публикации (идентификатор комментария,
-- идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;

SELECT
  comments.id,
  comments.articleId,
  users.firstName,
  users.lastName,
  comments.text
FROM comments
  JOIN users ON comments.userId = users.id
WHERE comments.articleId = 1
  ORDER BY comments.createdAt DESC;

-- 8. Обновить заголовок определённой публикации на «Как я встретил Новый год»;

UPDATE articles
  SET title = 'Как я встретил Новый год'
WHERE id = 1;
