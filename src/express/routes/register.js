'use strict';

const {Router} = require(`express`);

const {getErrorMessage, getImage} = require(`../../utils`);
const {uploadImage} = require(`../middlewares`);
const {createUser} = require(`../api`);

const route = new Router();

const pageContent = {
  title: `Регистрация`,
  bodyStyle: ``,
  divClass: `wrapper`,
  header: `loggedOff`,
};

route.get(`/`, (_req, res) => {
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

route.post(`/`, uploadImage.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const user = {
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    password: body.password,
    repeatPassword: body.repeatPassword,
    avatar: getImage(file, body),
  };

  try {
    await createUser(user);

    return res.redirect(`/my`);
  } catch (error) {
    const errorMessage = getErrorMessage(error.response.data.message);

    console.log(`req`, user, errorMessage);
    return res.render(`pages/sign-up`, {...pageContent, user, errorMessage});
  }
});

module.exports = route;
