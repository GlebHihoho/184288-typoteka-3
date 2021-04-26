'use strict';

const {Router} = require(`express`);

const api = require(`../api`);

const route = new Router();

route.get(`/`, async (req, res) => {
  let result = [];

  try {
    result = await api.searchArticle(req.query.search);
  } catch (e) {
    result = [];
  }

  const pageContent = {
    title: `Поиск`,
    bodyStyle: ``,
    divClass: `wrapper-color`,
    header: `search`,
    search: req.query.search,
    result,
  };

  res.render(`pages/search`, pageContent);
});

module.exports = route;
