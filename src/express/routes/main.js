'use strict';

const {Router} = require(`express`);
const api = require(`../api`);

const mainRoute = new Router();

mainRoute.get(`/`, async (_req, res) => {
  const categories = await api.getCategories();
  const articles = await api.getArticles();

  const pageContent = {
    title: `Главная страница`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOff`,
    categories,
    articles,
  };

  res.render(`pages/main`, pageContent);
});

module.exports = mainRoute;
