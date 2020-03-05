'use strict';

const {Router} = require(`express`);

const registerRoute = new Router();

const pageContent = {
  title: `Регистрация`,
  bodyStyle: ``,
  divClass: `wrapper`,
  header: `loggedOff`,
};

registerRoute.get(`/`, (req, res) => {
  return res.render(`pages/sign-up`, pageContent);
});

module.exports = registerRoute;
