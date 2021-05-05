'use strict';

const {Router} = require(`express`);
const api = require(`../api`);

const myRoute = new Router();

const pageContent = {
  title: `Комментарии`,
  bodyStyle: ``,
  divClass: `wrapper wrapper--nobackground`,
  header: `search`,
};

myRoute.get(`/`, async (_req, res) => {
  const articles = await api.getArticles();

  return res.render(`pages/my`, {
    ...pageContent,
    title: `Публикации`,
    articles,
  });
});

myRoute.post(`/delete/:articleId`, async (req, res) => {
  const id = req.params.articleId;

  await api.deleteArticle(id);

  res.redirect(`/my`);
});

myRoute.get(`/comments`, async (_req, res) => {
  pageContent.title = `Комментарии`;
  return res.render(`pages/comments`, pageContent);
});

module.exports = myRoute;
