'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const random = require(`lodash/random`);
const take = require(`lodash/take`);
const {logger} = require(`../lib/logger`);
const {EXIT_CODE} = require(`../../constants`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;

const USERS = [
  {
    email: `1111ivanov@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg1`
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
  const title = take(shuffledSentences, 1).join(`, `).substring(0, 250);
  const preview = take(shuffledSentences, 2).join(`, `).substring(0, 250);
  const fullText = take(shuffledSentences, 3).join(`, `).substring(0, 250);

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

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = random(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            random(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const getArticles = (count, sentences, categories, comments, users) => (
  [...Array(count)].map((_, index) => {
    const {title, preview, fullText} = getArticleText(sentences);
    const сategory = take(getRandomSubarray(categories), 2);
    const preparedComments = getComments(comments, users.length - 1, index + 1);

    return {
      title,
      fullText,
      categories: сategory.map((item) => item.id),
      preview,
      image: `image${index}.png`,
      comments: preparedComments,
      userId: random(1, users.length - 1),
    };
  })
);

module.exports = {
  name: `--filldb`,
  run: async (args) => {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }

    logger.info(`Connection to database established`);

    const {Article, Category, User} = defineModels(sequelize);

    await sequelize.sync({force: true});

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

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({name: item}))
    );

    await User.bulkCreate(USERS);

    const articles = getArticles(countArticles, sentences, categoryModels, commentsSentences, USERS);

    const articlesPromise = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
      return await articleModel.addCategories(article.categories);
    });

    await Promise.all(articlesPromise);

    try {

      return process.exit(EXIT_CODE.SUCCESS);
    } catch (error) {

      return process.exit(EXIT_CODE.ERROR);
    }
  },
};
