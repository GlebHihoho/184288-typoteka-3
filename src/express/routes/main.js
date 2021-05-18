'use strict';

const {Router} = require(`express`);
const api = require(`../api`);

const mainRoute = new Router();

const OFFERS_PER_PAGE = 8;

mainRoute.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [categories, mostPopularArticles, comments, {rows, count}] = await Promise.all([
    api.getCategories(),
    api.getMostPopularArticles(),
    api.getLastComments(),
    api.getArticles({limit, offset})
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  const pageContent = {
    title: `Главная страница`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOff`,
    categories,
    mostPopularArticles,
    comments,
    articles: rows,
    page,
    totalPages,
  };

  res.render(`pages/main`, pageContent);
});

module.exports = mainRoute;
