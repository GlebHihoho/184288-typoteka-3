'use strict';

const {Router} = require(`express`);

const loginRoute = new Router();

loginRoute.get(`/`, (req, res) => res.send(`/login`));

module.exports = loginRoute;
