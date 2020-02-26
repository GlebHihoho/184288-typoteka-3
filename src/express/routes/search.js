'use strict';

const {Router} = require(`express`);

const searchRoute = new Router();

searchRoute.get(`/`, (req, res) => res.send(`/search`));

module.exports = searchRoute;
