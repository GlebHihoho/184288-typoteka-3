'use strict';

const {Router} = require(`express`);

const mainRoute = new Router();

const pageContent = {
  title: `Главная страница`,
  bodyStyle: ``,
  divClass: `wrapper`,
  header: `loggedOff`,
};

mainRoute.get(`/`, (req, res) => {
  res.render(`pages/main`, pageContent);
});

module.exports = mainRoute;
