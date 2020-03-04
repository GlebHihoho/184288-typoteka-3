'use strict';

const {Router} = require(`express`);

const myRoute = new Router();

const pageContent = {
  title: `Комментарии`,
  bodyStyle: ``,
  divClass: `wrapper wrapper--nobackground`,
  header: `search`,
};

myRoute.get(`/`, (req, res) => {
  pageContent.title = `Публикации`;
  return res.render(`pages/my`, pageContent);
});

myRoute.get(`/comments`, (req, res) => {
  pageContent.title = `Комментарии`;
  return res.render(`pages/comments`, pageContent);
});

module.exports = myRoute;
