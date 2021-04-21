'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const random = require(`lodash/random`);
const take = require(`lodash/take`);
const {logger} = require(`../lib/logger`);
const {EXIT_CODE} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `fill-db-generate.sql`;

const USERS = [
  {
    email: `ivanov@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  },
  {
    email: `nikolaev@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Николай`,
    lastName: `Николаев`,
    avatar: `avatar3.jpg`
  }
];

const shuffleArray = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    logger.error(chalk.red(err));
    return [];
  }
};

const getArticleText = (sentences) => {
  const shuffledSentences = shuffleArray(sentences);
  const title = take(shuffledSentences, 1);
  const preview = take(shuffledSentences, 2);
  const fullText = take(shuffledSentences, 3);

  return {title, preview, fullText};
};

const getComments = (comments, usersCount, articleId) => {
  const randomLength = random(1, comments.length - 1);
  const shuffledComments = shuffleArray(comments);
  const preparedComments = take(shuffledComments, randomLength).map((comment) => {
    const userId = random(1, usersCount);
    return {
      userId,
      articleId,
      text: comment
    };
  });

  return preparedComments;
};

const getArticles = (count, sentences, categories, comments, users) => (
  [...Array(count)].map((_, index) => {
    const {title, preview, fullText} = getArticleText(sentences);
    const сategory = random(1, categories.length - 1);
    const preparedComments = getComments(comments, users.length - 1, index + 1);

    return {
      title,
      fullText,
      сategory,
      preview,
      image: `image${index}.png`,
      comments: preparedComments,
      userId: random(1, users.length - 1),
    };
  })
);

const getContent = (userValues, categoryValues, articleValues, articleCategoryValues, commentValues) => (`
  INSERT INTO users(email, password, first_name, last_name, avatar) VALUES ${userValues};

  INSERT INTO categories(name) VALUES ${categoryValues};

  ALTER TABLE articles DISABLE TRIGGER ALL;
  INSERT INTO articles(title, preview, full_text, image, user_id) VALUES ${articleValues};
  ALTER TABLE articles ENABLE TRIGGER ALL;

  ALTER TABLE articles_categories DISABLE TRIGGER ALL;
  INSERT INTO articles_categories(article_id, category_id) VALUES ${articleCategoryValues};
  ALTER TABLE articles_categories ENABLE TRIGGER ALL;

  ALTER TABLE comments DISABLE TRIGGER ALL;
  INSERT INTO comments(text, user_id, article_id) VALUES ${commentValues};
  ALTER TABLE comments ENABLE TRIGGER ALL;
`);

module.exports = {
  name: `--fill`,
  run: async (args) => {
    const [count] = args;
    let countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticles <= 0) {
      logger.error(chalk.red(`Параметр <count> не может быть отрицательным`));
      return process.exit(EXIT_CODE.ERROR);
    }

    if (countArticles > MAX_COUNT) {
      logger.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      return process.exit(EXIT_CODE.ERROR);
    }

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentsSentences = await readContent(FILE_COMMENTS_PATH);

    const articles = getArticles(countArticles, sentences, categories, commentsSentences, USERS);

    const userValues = USERS.map(({email, password, firstName, lastName, avatar}) =>
      `('${email}', '${password}', '${firstName}', '${lastName}', '${avatar}')`).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const comments = articles.flatMap((article) => article.comments);
    const commentValues = comments.map(({text, userId, articleId}) => `('${text}', ${userId}, ${articleId})`).join(`,\n`);

    const articleCategory = articles.map((article, index) => ({articleId: index + 1, categoryId: article.сategory}));
    const articleCategoryValues = articleCategory.map(({articleId, categoryId}) =>`(${articleId}, ${categoryId})`).join(`,\n`);

    const articleValues = articles.map(({title, preview, fullText, image, userId}) =>
      `('${title}', '${preview}', '${fullText}', '${image}', ${userId})`).join(`,\n`);

    const content = getContent(userValues, categoryValues, articleValues, articleCategoryValues, commentValues);

    try {
      await fs.writeFile(FILE_NAME, content);
      logger.info(chalk.green(`Operation success. File created.`));
      return process.exit(EXIT_CODE.SUCCESS);
    } catch (error) {
      logger.error(chalk.red(`Can't write data to file...`));
      return process.exit(EXIT_CODE.ERROR);
    }
  },
};
