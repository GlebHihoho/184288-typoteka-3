'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const get = require(`lodash/get`);
const find = require(`lodash/find`);
const findIndex = require(`lodash/findIndex`);

const {HTTP_CODE} = require(`../../../constants`);

const articlesRoute = new Router();

const FILE_NAME = `mocks.json`;
const articleFields = [`title`, `announce`, `fullText`, `сategory`, `createdDate`, `comments`];

const readMocks = async () => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);

    return mocks;
  } catch (err) {
    return [];
  }
};

articlesRoute.get(`/`, async (_req, res) => {
  const articles = await readMocks();

  return res.send(articles);
});

articlesRoute.get(`/:articleId`, async (req, res) => {
  const articles = await readMocks();
  const id = req.params.articleId;
  const article = find(articles, [`id`, id]);

  if (!article) {
    return res.status(HTTP_CODE.NOT_FOUND).send(`Article not found`);
  }

  return res.send(article);
});

articlesRoute.post(`/`, async (req, res) => {
  const article = req.body;
  const articleKeys = Object.keys(article);
  const isValid = articleFields.every((field) => articleKeys.includes(field));
  const id = nanoid(6);
  console.log(`id - ${id}`);
  if (isValid) {
    const articles = await readMocks();
    articles.push({...article, id});
    const preparedArticles = JSON.stringify(articles, null, `  `);

    try {
      await fs.writeFile(FILE_NAME, preparedArticles);
      return res.send({...article, id});
    } catch (error) {
      return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(`Something went wrong`);
    }
  }

  return res.status(HTTP_CODE.NOT_FOUND).send(`Something went wrong`);
});

articlesRoute.put(`/:articleId`, async (req, res) => {
  const id = req.params.articleId;
  const articleData = req.body;
  const articles = await readMocks();
  const article = find(articles, [`id`, id]);
  const articleIndex = findIndex(articles, [`id`, id]);

  if (!article) {
    return res.status(HTTP_CODE.NOT_FOUND).send(`Article not found`);
  }

  try {
    articles[articleIndex] = articleData;
    const preparedOffers = JSON.stringify(articles, null, `  `);
    await fs.writeFile(FILE_NAME, preparedOffers);
    return res.send(article);
  } catch (error) {
    return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(`Something went wrong`);
  }
});

articlesRoute.delete(`/:articleId`, async (req, res) => {
  const articles = await readMocks();
  const id = req.params.articleId;
  const article = find(articles, [`id`, id]);
  const filteredArticles = articles.filter((item) => item.id !== id);
  const preparedArticles = JSON.stringify(filteredArticles, null, `  `);

  if (!article) {
    return res.status(HTTP_CODE.NOT_FOUND).send(`Article not found`);
  }

  try {
    await fs.writeFile(FILE_NAME, preparedArticles);
  } catch (error) {
    return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(`Something went wrong`);
  }

  return res.send(article);
});

articlesRoute.get(`/:articleId/comments`, async (req, res) => {
  const articles = await readMocks();
  const id = req.params.articleId;
  const article = find(articles, [`id`, id]);
  const comments = get(article, `comments`);

  if (!article) {
    return res.status(HTTP_CODE.NOT_FOUND).send(`Article not found`);
  }

  return res.send(comments);
});

articlesRoute.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  const articleId = req.params.articleId;
  const commentId = req.params.commentId;

  const articles = await readMocks();
  const article = find(articles, [`id`, articleId]);
  const comment = find(article.comments, [`id`, commentId]);
  const articleIndex = findIndex(articles, [`id`, articleId]);

  if (!article && !comment) {
    return res.status(HTTP_CODE.NOT_FOUND).send(`Offer not found`);
  }

  try {
    article.comments = article.comments.filter((item) => item.id !== commentId);
    articles[articleIndex].comments = article.comments;
    const preparedArticles = JSON.stringify(articles, null, `  `);
    await fs.writeFile(FILE_NAME, preparedArticles);
  } catch (error) {
    return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(`Something went wrong`);
  }

  return res.send(commentId);
});

articlesRoute.post(`/:articleId/comments`, async (req, res) => {
  const id = req.params.articleId;
  const comment = req.body;
  let articles = await readMocks();
  const article = find(articles, [`id`, id]);

  if (!article) {
    return res.status(HTTP_CODE.NOT_FOUND).send(articles);
  }

  try {
    articles = articles.map((item) => {
      if (item.id === id) {
        return {...item, comments: [...item.comments, {id: nanoid(6), text: comment.text}]};
      }
      return item;
    });

    const preparedOffers = JSON.stringify(articles, null, `  `);
    await fs.writeFile(FILE_NAME, preparedOffers);
  } catch (error) {
    console.log(error);
    return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(`Something went wrong`);
  }

  return res.send(comment);
});


module.exports = articlesRoute;
