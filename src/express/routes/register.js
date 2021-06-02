'use strict';

const {Router} = require(`express`);

const registerRoute = new Router();

const pageContent = {
  title: `Регистрация`,
  bodyStyle: ``,
  divClass: `wrapper`,
  header: `loggedOff`,
};

registerRoute.get(`/`, (_req, res) => {
  const user = {
    email: ``,
    firstName: ``,
    lastName: ``,
    password: ``,
    repeatPassword: ``,
    avatar: ``,
  };
  return res.render(`pages/sign-up`, {...pageContent, user, errorMessage: {}});
});

module.exports = registerRoute;
