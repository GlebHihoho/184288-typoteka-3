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
  const articles = await api.getArticles({limit: 8, offset: 0});

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

  try {
    const comments = await api.getAllComments();

    return res.render(`pages/comments`, {...pageContent, comments});
  } catch (error) {
    return res.render(`pages/comments`, pageContent);
  }
});

myRoute.get(`/comments/delete/:commentId`, async (req, res) => {
  const id = req.params.commentId;

  try {
    await api.deleteComment(id);

    return res.redirect(`/my/comments`);
  } catch (error) {
    return res.render(`pages/500`);
  }
});

module.exports = myRoute;
