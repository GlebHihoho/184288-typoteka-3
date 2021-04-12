'use strict';

const {Router} = require(`express`);
const api = require(`../api`);

const categoriesRoute = new Router();

const pageContent = {
  title: `Категории`,
  bodyStyle: ``,
  divClass: `wrapper wrapper--nobackground`,
  header: `search`,
};

categoriesRoute.get(`/`, async (_req, res) => {
  const categories = await api.getCategories();
  return res.render(`pages/all-categories`, {...pageContent, categories});
});

module.exports = categoriesRoute;
