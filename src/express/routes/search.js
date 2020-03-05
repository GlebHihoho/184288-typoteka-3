'use strict';

const {Router} = require(`express`);

const searchRoute = new Router();

const pageContent = {
  title: `Поиск`,
  bodyStyle: ``,
  divClass: `wrapper-color`,
  header: `search`,
};

searchRoute.get(`/`, (req, res) => {
  res.render(`pages/search`, pageContent);
});

module.exports = searchRoute;
