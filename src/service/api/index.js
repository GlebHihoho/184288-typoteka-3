'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const ArticleService = require(`../data-service/article`);
const CategoryService = require(`../data-service/category`);
const CommentService = require(`../data-service/comment`);
const SearchService = require(`../data-service/search`);

const articles = require(`./articles`);
const categories = require(`./categories`);
const comments = require(`./comments`);
const search = require(`./search`);

const app = new Router();

defineModels(sequelize);

(() => {
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  comments(app, new CommentService(sequelize));
})();

module.exports = app;
