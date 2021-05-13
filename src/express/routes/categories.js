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

categoriesRoute.get(`/`, async (_, res) => {
  const categories = await api.getCategories();

  return res.render(`pages/all-categories`, {...pageContent, categories});
});

categoriesRoute.post(`/`, async (req, res) => {
  await api.createCategory(req.body);

  return res.redirect(`/categories`);
});

categoriesRoute.post(`/:categoryId`, async (req, res) => {
  const id = req.params.categoryId;

  await api.updateCategory(id, req.body);

  return res.redirect(`/categories`);
});

categoriesRoute.get(`/delete/:categoryId`, async (req, res) => {
  const id = req.params.categoryId;

  await api.deleteCategory(id);

  return res.redirect(`/categories`);
});

module.exports = categoriesRoute;
