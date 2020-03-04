'use strict';

const {Router} = require(`express`);

const categoriesRoute = new Router();

const pageContent = {
  title: `Категории`,
  bodyStyle: ``,
  divClass: `wrapper wrapper--nobackground`,
  header: `search`,
};

categoriesRoute.get(`/`, (req, res) => {
  return res.render(`pages/all-categories`, pageContent);
});

module.exports = categoriesRoute;
