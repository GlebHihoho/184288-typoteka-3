-- filling users table

INSERT INTO users(email, password, firstName, lastName, avatar)
  VALUES
    ('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
    ('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg'),
    ('nikolaev@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Николай', 'Николаев', 'avatar3.jpg');


-- filling categories table

INSERT INTO categories(name)
  VALUES
    ('Разное'),
    ('IT'),
    ('Музыка'),
    ('Кино'),
    ('Железо');


-- filling articles table

ALTER TABLE articles DISABLE TRIGGER ALL;

INSERT INTO articles(title, fullText, image, userId)
  VALUES
    ('PostgreSQL', 'PostgreSQL и node.js...', 'image1.jpg', 1),
    ('Лучше рок-музыканты', 'Лучше рок-музыканты 20-века...', 'image1.jpg', 2),
    ('Самый лучший музыкальный альбом', 'Самый лучший музыкальный альбом этого года...', 'image1.jpg', 3);

ALTER TABLE articles ENABLE TRIGGER ALL;


-- filling articles_categories table

ALTER TABLE articles_categories DISABLE TRIGGER ALL;

INSERT INTO articles_categories(articleId, categoryId)
  VALUES
    (1, 2),
    (1, 1),
    (2, 3),
    (2, 1),
    (3, 3),
    (3, 1);

ALTER TABLE articles_categories ENABLE TRIGGER ALL;


-- filling comments table

ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO comments(text, userId, articleId)
  VALUES
    ('Плюсую, но слишком много буквы!', 2, 1),
    ('Планируете записать видосик на эту тему?', 3, 1),
    ('Согласен с автором!', 1, 2),
    ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 3, 2),
    ('Совсем немного..', 1, 3),
    ('Совсем много..', 2, 3);

ALTER TABLE comments ENABLE TRIGGER ALL;
