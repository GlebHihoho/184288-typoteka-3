'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);
const random = require(`lodash/random`);
const now = require(`lodash/now`);
const take = require(`lodash/take`);

const {
  EXIT_CODE,
} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;
const MONTHS = 3;
const DAYS_IN_MONTH = 30;
const HOURS_IN_DAY = 24;
const MINNUTES_IN_HOUR = 60;
const SECONDS_IN_MINNUTES = 60;
const MILLISECONDS_IN_SECOND = 1000;
const MAX_ANNOUNCE_SENTENCES = 5;

const getRandomElement = (array) => array[random(array.length - 1)];

const getRandomeDate = () => {
  const msInThreeMonth = MONTHS * DAYS_IN_MONTH * HOURS_IN_DAY * MINNUTES_IN_HOUR * SECONDS_IN_MINNUTES * MILLISECONDS_IN_SECOND;
  const timestamp = now();
  const randomTimestamp = random(timestamp - msInThreeMonth, timestamp);

  return new Date(randomTimestamp).toLocaleString();
};

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
    console.error(chalk.red(err));
    return [];
  }
};

const getAnnounceAndFullText = (sentences) => {
  const announceSentences = random(1, MAX_ANNOUNCE_SENTENCES);
  const fullTextSentences = random(MAX_ANNOUNCE_SENTENCES, sentences.length - 1);
  const shuffledSentences = shuffleArray(sentences);
  const announce = take(shuffledSentences, announceSentences);
  const fullText = take(shuffledSentences, fullTextSentences);

  return {announce, fullText};
};

const getRandomCategories = (categories) => {
  const randomLength = random(1, categories.length - 1);
  const shuffledCategories = shuffleArray(categories);
  const preparedCategories = take(shuffledCategories, randomLength);

  return preparedCategories;
};

const getComments = (comments) => {
  const randomLength = random(1, comments.length - 1);
  const shuffledComments = shuffleArray(comments);
  const preparedComments = take(shuffledComments, randomLength).map((comment) => ({id: nanoid(6), text: comment}));

  return preparedComments;
};

const getPublications = (count, titles, sentences, categories, comments) => (
  [...Array(count)].map(() => {
    const title = getRandomElement(titles);
    const createdDate = getRandomeDate();
    const {announce, fullText} = getAnnounceAndFullText(sentences);
    const сategory = getRandomCategories(categories);
    const preparedComments = getComments(comments);
    const id = nanoid(6);

    return {
      id,
      title,
      announce,
      fullText,
      сategory,
      createdDate,
      comments: preparedComments,
    };
  })
);

module.exports = {
  name: `--generate`,
  run: async (args) => {
    const [count] = args;
    let countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublications <= 0) {
      console.log(chalk.red(`Параметр <count> не может быть отрицательным`));
      return process.exit(EXIT_CODE.ERROR);
    }

    if (countPublications > MAX_COUNT) {
      console.log(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      return process.exit(EXIT_CODE.ERROR);
    }

    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const publications = getPublications(countPublications, titles, sentences, categories, comments);
    const preparedPublications = JSON.stringify(publications, null, `  `);

    try {
      await fs.writeFile(FILE_NAME, preparedPublications);
      console.log(chalk.green(`Операция выполнена успешно. Файл был создан.`));
      return process.exit(EXIT_CODE.SUCCESS);
    } catch (error) {
      console.error(chalk.red(`Не могу записать данные в файл...`));
      return process.exit(EXIT_CODE.ERROR);
    }
  },
};
