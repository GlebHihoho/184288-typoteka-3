'use strict';

const {Router} = require(`express`);
// TODO: remove it after adding pagination
const take = require(`lodash/take`);
const api = require(`../api`);

const mainRoute = new Router();

mainRoute.get(`/`, async (_req, res) => {
  const [categories, mostPopularArticles, comments, articles] = await Promise.all([
    api.getCategories(),
    api.getMostPopularArticles(),
    api.getLastComments(),
    api.getArticles()
  ]);

  const pageContent = {
    title: `Главная страница`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOff`,
    categories,
    mostPopularArticles,
    comments,
    articles: take(articles, 4),
  };

  res.render(`pages/main`, pageContent);
});

module.exports = mainRoute;
