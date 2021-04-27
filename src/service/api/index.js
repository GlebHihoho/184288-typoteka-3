'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const ArticleService = require(`../data-service/article`);
const CategoryService = require(`../data-service/category`);
const CommentService = require(`../data-service/comment`);
const SearchService = require(`../data-service/search`);

const categories = require(`./categories`);
const articles = require(`./articles`);
const search = require(`./search`);

const app = new Router();

defineModels(sequelize);

(() => {
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
