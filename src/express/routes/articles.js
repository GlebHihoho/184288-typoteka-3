'use strict';

const {Router} = require(`express`);

const articlesRoute = new Router();

articlesRoute.get(`/add`, (req, res) => {
  const pageContent = {
    title: `Новая публикация`,
    bodyStyle: `height: 1050px;`,
    divClass: `wrapper`,
    header: `search`,
  };
  return res.render(`pages/new-post`, pageContent);
});

articlesRoute.get(`/:id`, (req, res) => {
  const pageContent = {
    title: `Публикация`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOn`,
  };
  return res.render(`pages/post`, pageContent);
});

articlesRoute.get(`/category/:id`, (req, res) => {
  const pageContent = {
    title: `Публикации в категории`,
    bodyStyle: ``,
    divClass: `wrapper`,
    header: `loggedOff`,
  };
  return res.render(`pages/articles-by-category`, pageContent);
});

module.exports = articlesRoute;
