-- filling users table

INSERT INTO users(email, password, first_name, last_name, avatar)
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

INSERT INTO articles(title, preview, full_text, image, user_id)
  VALUES
    ('PostgreSQL', 'PostgreSQL...', 'PostgreSQL и node.js...', 'image1.jpg', 1),
    ('Лучше рок-музыканты', 'Лучше...', 'Лучше рок-музыканты 20-века...', 'image1.jpg', 2),
    ('Самый лучший музыкальный альбом', 'Самый...', 'Самый лучший музыкальный альбом этого года...', 'image1.jpg', 3);

ALTER TABLE articles ENABLE TRIGGER ALL;


-- filling articles_categories table

ALTER TABLE articles_categories DISABLE TRIGGER ALL;

INSERT INTO articles_categories(article_id, category_id)
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

INSERT INTO comments(text, user_id, article_id)
  VALUES
    ('Плюсую, но слишком много буквы!', 2, 1),
    ('Планируете записать видосик на эту тему?', 3, 1),
    ('Согласен с автором!', 1, 2),
    ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 3, 2),
    ('Совсем немного..', 1, 3),
    ('Совсем много..', 2, 3);

ALTER TABLE comments ENABLE TRIGGER ALL;
