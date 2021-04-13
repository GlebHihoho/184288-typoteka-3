CREATE DATABASE typoteka
  WITH
  OWNER = admin
  ENCODING = 'UTF8'
  CONNECTION LIMIT = -1;

GRANT ALL ON DATABASE typoteka TO admin;

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(30) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  firstName varchar(255) NOT NULL,
  lastName varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL
);

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  fullText varchar(255),
  image varchar(50),
  userId integer NOT NULL,
  createdAt timestamp DEFAULT current_timestamp,
  FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE SET NULL
);

CREATE INDEX ON articles (title);

CREATE TABLE articles_categories(
  articleId integer NOT NULL,
  categoryId integer NOT NULL,
  PRIMARY KEY (articleId, categoryId),
  FOREIGN KEY (articleId) REFERENCES articles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  articleId integer NOT NULL,
  userId integer NOT NULL,
  createdAt timestamp DEFAULT current_timestamp,
  FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (articleId) REFERENCES articles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
