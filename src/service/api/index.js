'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const CategoryService = require(`../data-service/category`);
const ArticleService = require(`../data-service/article`);
const SearchService = require(`../data-service/search`);

const categories = require(`./categories`);
const articles = require(`./articles`);
const search = require(`./search`);

const app = new Router();

defineModels(sequelize);

(() => {
  categories(app, new CategoryService(sequelize));
  articles(app, new ArticleService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
