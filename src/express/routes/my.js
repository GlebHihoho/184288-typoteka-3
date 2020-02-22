'use strict';

const {Router} = require(`express`);

const myRoute = new Router();

myRoute.get(`/`, (req, res) => res.send(`/my`));
myRoute.get(`/comments`, (req, res) => res.send(`/my/comments`));

module.exports = myRoute;
