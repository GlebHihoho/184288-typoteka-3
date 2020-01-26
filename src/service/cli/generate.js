'use strict';

const fs = require(`fs`);
const random = require(`lodash/random`);
const now = require(`lodash/now`);
const take = require(`lodash/take`);

const {
  EXIT_CODE,
} = require(`../../constants`);

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

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];
const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];
const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const getRandomElement = (array) => array[random(array.length - 1)];

const getRandomeDate = () => {
  const msInThreeMonth = MONTHS * DAYS_IN_MONTH * HOURS_IN_DAY * MINNUTES_IN_HOUR * SECONDS_IN_MINNUTES * MILLISECONDS_IN_SECOND;
  const timestamp = now();
  const randomTimestamp = random(timestamp - msInThreeMonth, timestamp);

  return new Date(randomTimestamp).toLocaleString();
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getAnnounceAndFullText = (sentences) => {
  const announceSentences = random(1, MAX_ANNOUNCE_SENTENCES);
  const fullTextSentences = random(MAX_ANNOUNCE_SENTENCES, sentences.length - 1);
  const shuffledSentences = shuffle(sentences);
  const announce = take(shuffledSentences, announceSentences);
  const fullText = take(shuffledSentences, fullTextSentences);

  return {announce, fullText};
};

const getRandomCategories = (categories) => {
  const randomLength = random(1, categories.length - 1);
  const shuffledCategories = shuffle(categories);
  const preparedCategories = take(shuffledCategories, randomLength);

  return preparedCategories;
};

const getPublications = (count) => (
  [...Array(count)].map(() => {
    const title = getRandomElement(TITLES);
    const createdDate = getRandomeDate();
    const {announce, fullText} = getAnnounceAndFullText(SENTENCES);
    const сategory = getRandomCategories(CATEGORIES);

    return {
      title,
      announce,
      fullText,
      сategory,
      createdDate,
    };
  })
);

module.exports = {
  name: `--generate`,
  run: (args) => {
    const [count] = args;
    let countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countPublications <= 0) {
      return console.log(`Параметр <count> не может быть отрицательным`);
    }

    if (countPublications > MAX_COUNT) {
      return console.log(`Не больше ${MAX_COUNT} публикаций`);
    }
    const publications = getPublications(countPublications);

    fs.writeFile(FILE_NAME, JSON.stringify(publications, null, `  `), (err) => {
      if (err) {
        console.error(`Can't write data to file...`);
        return process.exit(EXIT_CODE.ERROR);
      }

      console.info(`Operation success. File created.`);
      return process.exit(EXIT_CODE.SUCCESS);
    });

    return publications;
  },
};
