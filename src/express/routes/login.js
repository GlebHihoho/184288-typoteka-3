'use strict';

const {Router} = require(`express`);

const loginRoute = new Router();

const pageContent = {
  title: `Вход`,
  bodyStyle: ``,
  divClass: `wrapper`,
  header: `loggedOff`,
};

loginRoute.get(`/`, (req, res) => {
  return res.render(`pages/login`, pageContent);
});

module.exports = loginRoute;
